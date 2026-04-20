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
/*
✅ Core Idea

👉 NODE_ENV does NOT contain your config values
👉 It only tells your app WHICH config to load

🔍 Think of it like this
NODE_ENV = development → “Use development settings”
NODE_ENV = production → “Use production settings”

But…

❗ Where are those settings stored?
➡️ That’s what .env files are for

✅ 1. What NODE_ENV actually does

Your script:

NODE_ENV=development

👉 This only gives:

process.env.NODE_ENV === 'development'

That’s it ❗

It does NOT include:

DATABASE_URL ❌
JWT_SECRET ❌
RAZORPAY keys ❌
✅ 2. Where real values come from

From your .env.development:

DATABASE_URL=postgresql://...
JWT_SECRET=xxxxx
RAZORPAY_KEY_ID=xxxx

👉 These are the actual values your app needs

✅ 3. Your current flow (correct)
envFilePath: `.env.${process.env.NODE_ENV}`
So:
Step	What happens
1	Script sets NODE_ENV=development
2	NestJS reads it
3	Loads .env.development
4	Injects all variables into process.env
✅ 4. Without .env file

You would have to do this:

NODE_ENV=development \
DATABASE_URL=xxxx \
JWT_SECRET=xxxx \
RAZORPAY_KEY_ID=xxxx \
node dist/main.js

👉 This is:

messy ❌
hard to maintain ❌
unsafe ❌
✅ 5. Real-world usage
🔹 Local development

Use:

.env.development
🔹 Production (Render / Cloud)

Use:

Dashboard ENV variables (no .env file needed)

Example: Render
👉 You paste variables in UI

⚠️ Important Insight

👉 .env is NOT required because of NestJS
👉 It is required because your app needs configuration values

✅ Final Simple Analogy
NODE_ENV = which file to open 📂
.env file = what’s inside the file 📄
✅ Final Answer

👉 Script decides environment (dev/prod)
👉 .env provides actual configuration values

Both work together 🤝 — not replacements
*/