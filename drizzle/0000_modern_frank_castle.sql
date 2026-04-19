CREATE TYPE "public"."order_status" AS ENUM('PLACED', 'PAID', 'FAILED', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment" AS ENUM('CASH', 'CARD', 'UPI', 'RAZORPAY');--> statement-breakpoint
CREATE TABLE "ecom_nestjs_orderitems" (
	"orderitem_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ecom_nestjs_orders" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"status" "order_status" NOT NULL,
	"date" timestamp DEFAULT now(),
	"amount" numeric(10, 2),
	"total" numeric(10, 2),
	"ref" varchar(100),
	"payment_id" varchar(100),
	"payment_method" "payment" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ecom_nestjs_products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"price" real NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ecom_nestjs_products_name_unique" UNIQUE("name"),
	CONSTRAINT "ecom_nestjs_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ecom_nestjs_users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(200),
	"fullname" varchar(100) NOT NULL,
	"google_id" varchar(100),
	"roles" varchar(10)[] DEFAULT '{"customer"}',
	"address" varchar(200),
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ecom_nestjs_users_email_unique" UNIQUE("email"),
	CONSTRAINT "ecom_nestjs_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orderitems" ADD CONSTRAINT "ecom_nestjs_orderitems_order_id_ecom_nestjs_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ecom_nestjs_orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orderitems" ADD CONSTRAINT "ecom_nestjs_orderitems_product_id_ecom_nestjs_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."ecom_nestjs_products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecom_nestjs_orders" ADD CONSTRAINT "ecom_nestjs_orders_user_id_ecom_nestjs_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ecom_nestjs_users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "ecom_nestjs_users" USING btree ("email");