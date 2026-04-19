import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, inArray, desc } from 'drizzle-orm';
//import { db } from 'src/db/drizzle';
import { products, orders, orderItems } from 'src/db/schema';
import { CreateOrderDto } from './dto/create-order.dto';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { orderStatusEnum, paymentEnum } from 'src/db/schema';

import {  NotFoundException } from '@nestjs/common';
import { db } from '../../db/drizzle'; // adjust path if needed

type OrderStatus = typeof orderStatusEnum.enumValues[number];

@Injectable()
export class OrdersService {

    // ✅ FIX 1: Proper class property
    private razorpay: Razorpay;

    constructor(private configService: ConfigService) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID')!,
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
        });
    }

    //--------------------------------------------
    // 🔥 UPDATE ORDER STATUS
    async updateStatus(orderId: number, status: OrderStatus) {
        // 1️⃣ Check if order exists
        const existing = await db
            .select()
            .from(orders)
            .where(eq(orders.orderId, orderId));

        if (!existing.length) {
            throw new NotFoundException('Order not found');
        }
        const allowedStatuses = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        if (!allowedStatuses.includes(status)) {
            throw new BadRequestException('Invalid status');
        }

        // 2️⃣ Update status
        const updated = await db
            .update(orders)
            .set({
                status
            })
            .where(eq(orders.orderId, orderId))
            .returning();

        return {
            message: 'Order status updated successfully',
            order: updated[0],
        };
    }
    //--------------------------------------------

    // 🔥 CREATE RAZORPAY ORDER
    async createRazorpayOrder(userId: number, dto: CreateOrderDto) {
        // 1. Create DB order
        const order = await this.createOrder(userId, dto);

        // 2. Create Razorpay order
        /* const razorpayOrder = await this.razorpay.orders.create({
            //amount: Number(order.total) * 100, // paise
            amount: Math.round(Number(order.total) * 100),
            currency: 'INR',
        }); */
        //--------------------------------------
        const total = Number(order.total);

        if (!Number.isFinite(total)) {
            throw new BadRequestException('Invalid order total');
        }

        const paise = Math.round(total * 100);

        const razorpayOrder = await this.razorpay.orders.create({
            amount: paise,
            currency: 'INR',
        });
        //--------------------------------------

        // 3. Save Razorpay orderId in DB
        await this.updateOrderRef(order.orderId, razorpayOrder.id);

        return {
            ...order,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
        };
    }

    // 🔐 VERIFY PAYMENT
    async verifyPayment(body: any) {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET')!;

        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            throw new BadRequestException('Invalid payment signature');
        }

        // ✅ FIX: pass BOTH values
        await this.markOrderPaid(
            razorpay_order_id,
            razorpay_payment_id
        );

        return {
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
        };
    }

    // 🛒 CREATE ORDER (DB)
    async createOrder(userId: number, dto: CreateOrderDto) {
        const productIds = dto.items.map((i) => i.productId);

        const productList = await db
            .select()
            .from(products)
            .where(inArray(products.productId, productIds));

        if (!productList.length) {
            throw new BadRequestException('Invalid products');
        }

        const productMap = new Map(
            productList.map((p) => [p.productId, p.price]),
        );

        let total = 0;

        const orderItemsData = dto.items.map((item) => {
            const price = productMap.get(item.productId);

            if (!price) {
                throw new BadRequestException(
                    `Product not found: ${item.productId}`,
                );
            }

            total += price * item.quantity;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price.toString(),
            };
        });

        // 🔥 Create Order
        const [order] = await db
            .insert(orders)
            .values([
                {
                    userId: userId,
                    status: 'PLACED' as typeof orderStatusEnum.enumValues[number],
                    total: total.toString(),   // ✅ FIX
                    amount: total.toString(),  // ✅ FIX
                    paymentMethod:
                        dto.paymentMethod as typeof paymentEnum.enumValues[number],
                },
            ])
            .returning();

        // 🔥 Insert Order Items
        const finalItems = orderItemsData.map((item) => ({
            ...item,
            orderId: order.orderId,
        }));

        await db.insert(orderItems).values(finalItems);

        return order;
    }

    // 📦 GET USER ORDERS
   /*  async getUserOrders(userId: number) {
        return db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.date));
    } */

    // 🔗 SAVE RAZORPAY REF
    async updateOrderRef(orderId: number, ref: string) {
        await db
            .update(orders)
            .set({ ref })
            .where(eq(orders.orderId, orderId));
    }

    // 💰 MARK PAID
    async markOrderPaid(razorpayOrderId: string, paymentId: string) {
        await db
            .update(orders)
            .set({
                status: 'PAID',
                paymentId: paymentId, // ✅ correct value
            })
            .where(eq(orders.ref, razorpayOrderId));
    }
    //------------------------------------------
    async getUserOrders(userId: number) {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.date));

        return Promise.all(
            userOrders.map(async (order) => {
                const items = await db
                    .select({
                        productId: orderItems.productId,
                        quantity: orderItems.quantity,
                        price: orderItems.price,
                        name: products.name,
                    })
                    .from(orderItems)
                    .leftJoin(products, eq(orderItems.productId, products.productId))
                    .where(eq(orderItems.orderId, order.orderId));

                return {
                    ...order,
                    items,
                };
            })
        );
    }
    //------------------------------------------
    async getOrderById(userId: number, orderId: number) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderId, orderId));

  if (!order) throw new BadRequestException("Order not found");

  const items = await db
    .select({
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      name: products.name,
      imageUrl: products.imageUrl,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.productId))
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    items,
  };
}
}