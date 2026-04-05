import { Controller, Post,Patch, UseGuards, Req, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { RequestWithUser } from 'src/common/types/request-with-user';
import { Get } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CurrentUser } from '../../common/decorators/current-user/current-user.decorator';
import { PaymentMethod } from './dto/create-order.dto';
import { orderStatusEnum } from '../../db/schema';

//@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService,
        private readonly cartService: CartService,
    ) { }
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getOrderById(
        @Param('id') id: number,
        @CurrentUser() user: any,
    ) {
        return this.ordersService.getOrderById(user.userId, id);
    }
    //------------------------------
    @UseGuards(AuthGuard('jwt'))
    @Post('razorpay/create-order')
    async createRazorpayOrder(
        @CurrentUser() user: any,
        @Body() dto: CreateOrderDto,
    ) {
        return this.ordersService.createRazorpayOrder(user.userId, dto);
    }

    @Post('razorpay/verify')
    async verifyPayment(@Body() body: any) {
        return this.ordersService.verifyPayment(body);
    }
    //------------------------------

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createOrder(@Req() req: RequestWithUser, @Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(req.user.userId, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getOrders(@Req() req: RequestWithUser) {
        return this.ordersService.getUserOrders(req.user.userId);
    }
    //------------------------------
    @UseGuards(AuthGuard('jwt'))
    @Post('checkout')
    async checkout(@CurrentUser() user: any) {

        const cart = this.cartService.getCart(user.userId);

        const dto: CreateOrderDto = {
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            paymentMethod: PaymentMethod.RAZORPAY, // ✅ FIX
        };

        const order = await this.ordersService.createOrder(user.userId, dto);

        this.cartService.clearCart(user.userId);

        return order;
    }
    //---------------------------------------
    @Patch(':id/status')
    updateStatus(
        @Param('id') id: number,
        @Body('status') status: typeof orderStatusEnum.enumValues[number],
    ) {
        return this.ordersService.updateStatus(id, status);
    }
}
/*
🧠 Rule to Remember (VERY IMPORTANT)

When using:

@Req()
@Body()
decorators + TypeScript strict mode

👉 ALWAYS:

import type { Something } from '...';
⚡ Quick Mental Shortcut
Import Type	Use
import { X }	Runtime value
import type { X }	Type only ✅
*/