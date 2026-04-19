import * as dotenv from 'dotenv';

// ✅ IMPORTANT FIX
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

import { defineConfig } from 'drizzle-kit';

console.log('DRIZZLE CONFIG DB:', process.env.DATABASE_URL); // debug

export default defineConfig({
    schema: './src/db/schema/index.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!, // ✅ now works
    },
});
//-----------------------------------------------------
/* import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema/index.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
}); */
//-------------------------------------------------
/*
IMPORTANT NOTE:
👉 ❌ You cannot use ConfigModule inside drizzle.config.ts
👉 ✅ You should use dotenv there

🚨 Why NOT ConfigModule here?

Your file:

drizzle.config.ts

👉 This file is executed by:

CLI (drizzle-kit)
Node directly (outside NestJS)

👉 At this point:

❌ NestJS app is NOT running
❌ Dependency Injection is NOT available
❌ ConfigService does NOT exist
🧩 Key Concept
Context	What to use
Inside NestJS app	✅ ConfigModule
Outside (CLI tools)	✅ dotenv
*/