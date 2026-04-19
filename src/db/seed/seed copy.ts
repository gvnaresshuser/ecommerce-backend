import 'dotenv/config'; // ✅ REQUIRED here
import { db } from '../drizzle';
import { products } from '../schema';

async function seed() {
    console.log('🌱 Seeding started...');

    await db.insert(products).values([
        {
            name: 'Wireless Mouse',
            slug: 'wireless-mouse',
            price: 25.99,
            description: 'A sleek and responsive wireless mouse.',
            imageUrl: 'https://www.sathya.in/media/3492/catalog/mouse.jpg',
        },
        {
            name: 'Bluetooth Speaker',
            slug: 'bluetooth-speaker',
            price: 45.0,
            description: 'Portable Bluetooth speaker.',
            imageUrl: 'https://www.shutterstock.com/image-photo/black-portable-mini-speaker-colorful-600nw-2561079163.jpg',
        },
        {
            name: 'Gaming Keyboard',
            slug: 'gaming-keyboard',
            price: 89.5,
            description: 'Mechanical RGB keyboard.',
            imageUrl: 'https://www.shutterstock.com/image-photo/gaming-keyboard-rgb-light-white-260nw-1920716873.jpg',
        },
        {
            name: 'USB-C Charger',
            slug: 'usb-c-charger',
            price: 19.99,
            description: 'Fast charging USB-C wall adapter.',
            imageUrl: 'https://www.shutterstock.com/image-photo/usb-c-fast-charger-isolated-260nw-1932141232.jpg',
        },
        {
            name: 'Noise Cancelling Headphones',
            slug: 'noise-cancelling-headphones',
            price: 129.99,
            description: 'Over-ear headphones with active noise cancellation.',
            imageUrl: 'https://www.shutterstock.com/image-photo/modern-wireless-headphones-isolated-on-260nw-1808380924.jpg',
        },
        {
            name: 'Smart Watch',
            slug: 'smart-watch',
            price: 199.0,
            description: 'Fitness tracking smartwatch with heart rate monitor.',
            imageUrl: 'https://www.shutterstock.com/image-photo/smart-watch-black-band-isolated-260nw-1719859162.jpg',
        },
        {
            name: 'External Hard Drive',
            slug: 'external-hard-drive',
            price: 79.99,
            description: '1TB portable external hard drive.',
            imageUrl: 'https://www.shutterstock.com/image-photo/external-hard-drive-isolated-on-260nw-1720980154.jpg',
        },
        {
            name: 'Laptop Stand',
            slug: 'laptop-stand',
            price: 29.99,
            description: 'Adjustable aluminum laptop stand.',
            imageUrl: 'https://www.shutterstock.com/image-photo/laptop-stand-isolated-on-white-260nw-1714982534.jpg',
        },
        {
            name: 'Wireless Earbuds',
            slug: 'wireless-earbuds',
            price: 59.99,
            description: 'Compact true wireless earbuds with charging case.',
            imageUrl: 'https://www.shutterstock.com/image-photo/wireless-earbuds-case-isolated-on-260nw-1906956154.jpg',
        },
        {
            name: 'HD Webcam',
            slug: 'hd-webcam',
            price: 49.99,
            description: '1080p HD webcam for video calls and streaming.',
            imageUrl: 'https://www.shutterstock.com/image-photo/webcam-isolated-on-white-background-260nw-1918416262.jpg',
        },
    ]);

    console.log('✅ Seeding completed');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});