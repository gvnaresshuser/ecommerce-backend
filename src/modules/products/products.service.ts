import { Injectable } from '@nestjs/common';
import { db } from '../../db/drizzle';
import { products } from '../../db/schema';
import { ilike } from 'drizzle-orm';

@Injectable()
export class ProductsService {

    async findAll(query: any) {
        const { search, limit = 10, offset = 0 } = query;

        if (search) {
            return db.select()
                .from(products)
                .where(ilike(products.name, `%${search}%`))
                .limit(limit)
                .offset(offset);
        }

        return db.select()
            .from(products)
            .limit(limit)
            .offset(offset);
    }
}