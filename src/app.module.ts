import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import paymentConfig from './config/payment.config';
import * as Joi from 'joi';

//pnpm add cross-env
console.log('NODE_ENV:', process.env.NODE_ENV);

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
    load: [paymentConfig],
    validationSchema: Joi.object({
      RAZORPAY_KEY_ID: Joi.string().required(),
      RAZORPAY_KEY_SECRET: Joi.string().required(),
    })
  }),
    UsersModule, ProductsModule, CartModule, OrdersModule, PaymentModule, AuthModule, DatabaseModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
/*
🎯 FINAL FLOW
.env → payment.config.ts → ConfigModule → ConfigService → OrdersService
🚫 Why NOT remove process.env completely?

Because:

👉 ConfigModule internally reads from environment
👉 You must define the entry point somewhere

🏁 FINAL ANSWER
❓ Can we avoid process.env in config file?

👉 ❌ No
👉 ✅ But limit it to ONLY config layer

🔥 PRO LEVEL SUMMARY
Layer	Use
config file	process.env ✅
services/controllers	ConfigService ✅
rest of app	❌ never use process.env
*/
