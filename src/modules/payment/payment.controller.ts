import { Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';
import { CartService } from '../cart/cart.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user/current-user.decorator';
import { Body } from '@nestjs/common';
import * as crypto from 'crypto';

@UseGuards(AuthGuard('jwt'))
@Controller('payment')
export class PaymentController {

  constructor(
    private paymentService: PaymentService,
    private ordersService: OrdersService,
    private cartService: CartService,
  ) { }

  @Post('create-order')
  async createOrder(@CurrentUser() user: any) {

    const cart = this.cartService.getCart(user.userId);

    // 1️⃣ Create DB order (PENDING)
    const order = await this.ordersService.createOrder(user.userId, {
      items: cart,
      paymentMethod: 'RAZORPAY',
    } as any);

    if (order.total == null) {
      throw new Error('Order total is missing');
    }

    // 2️⃣ Create Razorpay order - Use non-null assertion since we are sure total is present
    const razorpayOrder = await this.paymentService.createRazorpayOrder(Number(order.total));

    // 3️⃣ Save Razorpay order id
    await this.ordersService.updateOrderRef(order.orderId, razorpayOrder.id);

    return {
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    };
  }
  //-------------------------------------------------
  @Post('verify')
  async verify(@Body() body: any) {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected === razorpay_signature) {

      await this.ordersService.markOrderPaid(
        razorpay_order_id,
        razorpay_payment_id // ✅ FIX
      );

      return { success: true };
    }

    return { success: false };
  }
}
//----------------------------------------------------------
/*
🚀 What IS recommend
👉 Since you're building production-level system:
💯 Do BOTH:
total: real('total').notNull()
AND
order.total!
*/