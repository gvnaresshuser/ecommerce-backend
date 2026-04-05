import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {

    // userId → cart items
    private carts = new Map<number, any[]>();

    addToCart(userId: number, item: any) {
        const cart = this.carts.get(userId) || [];

        const existing = cart.find(i => i.productId === item.productId);

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }

        this.carts.set(userId, cart);

        return cart;
    }

    getCart(userId: number) {
        return this.carts.get(userId) || [];
    }

    removeItem(userId: number, productId: number) {
        const cart = this.carts.get(userId) || [];

        const updated = cart.filter(i => i.productId !== productId);

        this.carts.set(userId, updated);

        return updated;
    }

    clearCart(userId: number) {
        this.carts.delete(userId);
    }
}