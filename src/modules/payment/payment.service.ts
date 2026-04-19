import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {

  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  async createRazorpayOrder(amount: number) {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      throw new Error('Invalid amount');
    }

    // ✅ Convert to paise safely
    const paise = Math.round(numericAmount * 100);

    if (!Number.isInteger(paise)) {
      throw new Error('Amount conversion failed');
    }

    console.log('Final Razorpay Amount (paise):', paise); // debug

    return this.razorpay.orders.create({
      amount: paise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
  }

  /*  async createRazorpayOrder(amount: number) {
     return this.razorpay.orders.create({
       amount: Math.round(amount * 100), // paise
       currency: 'INR',
       receipt: `receipt_${Date.now()}`,
     });
   } */
}