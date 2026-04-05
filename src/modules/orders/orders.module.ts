import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartModule } from '../cart/cart.module'; // ✅ IMPORT
@Module({
  imports: [CartModule], // ✅ ADD THIS
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // ✅ VERY IMPORTANT
})
export class OrdersModule {}
