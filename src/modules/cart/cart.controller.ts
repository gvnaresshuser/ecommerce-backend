import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt.guard';


@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) { }

    @Post()
    addToCart(@Body() dto: AddToCartDto, @CurrentUser() user: any) {
        return this.cartService.addToCart(user.userId, dto);
    }

    @Get()
    getCart(@CurrentUser() user: any) {
        return this.cartService.getCart(user.userId);
    }

    @Delete(':productId')
    removeItem(@Param('productId') productId: string, @CurrentUser() user: any) {
        return this.cartService.removeItem(user.userId, Number(productId));
    }
}