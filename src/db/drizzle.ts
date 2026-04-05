import 'dotenv/config'; // ✅ VERY IMPORTANT
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

console.log('APP DB URL:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
});

export const db = drizzle(pool, { schema });

//-----------------------------------------------------
/* import 'dotenv/config'; // ✅ VERY IMPORTANT
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

console.log('DB URL:', process.env.DATABASE_URL);

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20, // production pool
});

export const db = drizzle(pool); */