export default () => ({
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
});
//pnpm add -D @types/node
/*
🧠 Key Concept (Important)

👉 process.env is only used once (inside config layer)
👉 Everywhere else → use ConfigService
*/