import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CartModule } from '../cart/cart.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule, CartModule], // ✅ ADD BOTH
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
