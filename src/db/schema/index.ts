import { pgTable,real,text, serial, integer, varchar, timestamp, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';

export const orderStatusEnum = pgEnum('order_status', [
    'PLACED',
    'PAID',
    'FAILED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
]);
//✅ USERS TABLE
// ENUM
export const paymentEnum = pgEnum('payment', ['CASH', 'CARD', 'UPI', 'RAZORPAY']);

export const users = pgTable('ecom_nestjs_users', {
    userId: serial('user_id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 200 }),
    fullname: varchar('fullname', { length: 100 }).notNull(),
    googleId: varchar('google_id', { length: 100 }),
    roles: varchar('roles', { length: 10 }).array().default(['customer']),
    address: varchar('address', { length: 200 }),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
}));

//✅ PRODUCTS TABLE
export const products = pgTable('ecom_nestjs_products', {
    productId: serial('product_id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    price: real('price').notNull(),
    description: text('description').notNull(),
    imageUrl: varchar('image_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});
//✅ ORDERS TABLE
export const orders = pgTable('ecom_nestjs_orders', {
    orderId: serial('order_id').primaryKey(),

    userId: integer('user_id')
        .notNull()
        .references(() => users.userId, { onDelete: 'cascade' }),

    status: orderStatusEnum('status').notNull(),

    date: timestamp('date').defaultNow(),

    amount: numeric('amount', { precision: 10, scale: 2 }),
    total: numeric('total', { precision: 10, scale: 2 }),

    ref: varchar('ref', { length: 100 }), // razorpay_order_id
    paymentId: varchar('payment_id', { length: 100 }), // razorpay_payment_id

    paymentMethod: paymentEnum('payment_method').notNull(),
});
//✅ ORDER ITEMS TABLE


export const orderItems = pgTable('ecom_nestjs_orderitems', {
    orderItemId: serial('orderitem_id').primaryKey(),
    orderId: integer('order_id')
        .notNull()
        .references(() => orders.orderId, { onDelete: 'cascade' }),

    productId: integer('product_id')
        .notNull()
        .references(() => products.productId, { onDelete: 'cascade' }),

    quantity: integer('quantity').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});
//-----------------------------------------------------------------------
//import { relations } from 'drizzle-orm';
/*
👉 You imported but not using it

✔ Either:

Remove it ✅
OR
Use it for joins (advanced, later step)
*/