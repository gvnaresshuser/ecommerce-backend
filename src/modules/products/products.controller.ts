import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterProductsDto } from './dto/filter-products.dto';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(@Query() query: FilterProductsDto) {
        return this.productsService.findAll(query);
    }
}   