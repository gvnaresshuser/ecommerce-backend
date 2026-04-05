import { pgTable, serial, varchar, timestamp, text, integer, real, numeric, pgEnum } from 'drizzle-orm/pg-core';

//✅ USERS TABLE
// ENUM
export const paymentEnum = pgEnum('payment', ['CASH', 'CARD', 'UPI', 'RAZORPAY']);

export const users = pgTable('ecom_nestjs_users', {
    userId: serial('user_id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull(),
    username: varchar('username', { length: 50 }).notNull(),
    password: varchar('password', { length: 200 }),
    fullname: varchar('fullname', { length: 100 }).notNull(),
    googleId: varchar('google_id', { length: 100 }),
    roles: varchar('roles', { length: 10 }).array().default(['customer']),
    address: varchar('address', { length: 200 }),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
});

//✅ PRODUCTS TABLE
export const products = pgTable('ecom_nestjs_products', {
    productId: serial('product_id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    price: real('price').notNull(),
    description: text('description').notNull(),
    imageUrl: varchar('image_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});
//✅ ORDERS TABLE
export const orders = pgTable('ecom_nestjs_orders', {
    orderId: serial('order_id').primaryKey(),
    userId: integer('user_id').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    date: timestamp('date').defaultNow(),
    amount: real('amount'),
    total: real('total'),
    ref: varchar('ref', { length: 100 }),
    paymentMethod: paymentEnum('payment_method'),
});

//✅ ORDER ITEMS TABLE
export const orderItems = pgTable('ecom_nestjs_orderitems', {
    orderItemId: serial('orderitem_id').primaryKey(),
    orderId: integer('order_id').notNull(),
    productId: integer('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});