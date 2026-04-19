import 'dotenv/config';
import { db } from '../drizzle';
import { products } from '../schema';

async function seed() {
    console.log('🌱 Seeding started...');

    await db.insert(products).values([
        {
            name: "Wireless Mouse",
            slug: "wireless-mouse",
            price: 25.99,
            description: "A sleek and responsive wireless mouse.",
            imageUrl: "https://www.sathya.in/media/3492/catalog/mouse.jpg",
        },
        {
            name: "Bluetooth Speaker",
            slug: "bluetooth-speaker",
            price: 45,
            description: "Portable Bluetooth speaker.",
            imageUrl: "https://www.shutterstock.com/image-photo/black-portable-mini-speaker-colorful-600nw-2561079163.jpg",
        },
        {
            name: "Gaming Keyboard",
            slug: "gaming-keyboard",
            price: 89.5,
            description: "Mechanical RGB keyboard.",
            imageUrl: "https://www.shutterstock.com/image-photo/gaming-keyboard-rgb-light-white-260nw-1920716873.jpg",
        },
        {
            name: "USB-C Charger",
            slug: "usb-c-charger",
            price: 19.99,
            description: "Fast charging USB-C wall adapter.",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSroElQ4dic32XBxVm1tvJUfMVWIBpI8_O1nA&s",
        },
        {
            name: "Noise Cancelling Headphones",
            slug: "noise-cancelling-headphones",
            price: 129.99,
            description: "Over-ear headphones with active noise cancellation.",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREb2jMoor5RZ8S-7_Z0fWinAi1IWu3lsczyw&s",
        },
        {
            name: "Smart Watch",
            slug: "smart-watch",
            price: 199,
            description: "Fitness tracking smartwatch with heart rate monitor.",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGkJO8iGhWl6ja-9wHdRnyIEBKvG2_lRkOQ&s",
        },
        {
            name: "External Hard Drive",
            slug: "external-hard-drive",
            price: 79.99,
            description: "1TB portable external hard drive.",
            imageUrl: "https://www.lifewire.com/thmb/cIR7Pfzz5ex1tTQohDGrgAcFDOU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/western-digital-my-passport-2tb-56a6fa9b3df78cf772913ec1.jpg",
        },
        {
            name: "Laptop Stand",
            slug: "laptop-stand",
            price: 29.99,
            description: "Adjustable aluminum laptop stand.",
            imageUrl: "https://m.media-amazon.com/images/I/61AS07l2cBL._AC_UF1000,1000_QL80_.jpg",
        },
        {
            name: "Wireless Earbuds",
            slug: "wireless-earbuds",
            price: 59.99,
            description: "Compact true wireless earbuds with charging case.",
            imageUrl: "https://www.shutterstock.com/image-photo/wireless-earbuds-case-isolated-on-260nw-1906956154.jpg",
        },
        {
            name: "HD Webcam",
            slug: "hd-webcam",
            price: 49.99,
            description: "1080p HD webcam for video calls and streaming.",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw8KafBbWGq9boVprbuNcTRF2GWyebH2NUnA&s",
        },
    ]);

    console.log('✅ Seeding completed');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});