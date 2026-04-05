CREATE TYPE "public"."order_status" AS ENUM('PLACED', 'PAID', 'FAILED');--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orders" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orders" ALTER COLUMN "total" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orders" ADD COLUMN "payment_id" varchar(100);