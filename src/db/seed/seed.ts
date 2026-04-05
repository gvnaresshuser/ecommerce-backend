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
    ]);

    console.log('✅ Seeding completed');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});