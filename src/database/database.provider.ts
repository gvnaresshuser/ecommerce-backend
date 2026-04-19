import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

export const DATABASE = 'DATABASE';

export const databaseProvider = {
    provide: DATABASE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        console.log('DB URL from ConfigService:', dbUrl);

        const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
            max: 20,
        });

        return drizzle(pool, { schema });
    },
};