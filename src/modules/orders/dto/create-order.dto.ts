import { IsArray, ValidateNested, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    UPI = 'UPI',
    RAZORPAY = 'RAZORPAY',
}
// 🔹 Single item DTO
class OrderItemDto {
    @IsInt()
    productId!: number;

    @IsInt()
    quantity!: number;
}

// 🔹 Main DTO
export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    /*   @IsEnum(['CASH', 'CARD', 'UPI', 'RAZORPAY'])
      paymentMethod!: 'CASH' | 'CARD' | 'UPI' | 'RAZORPAY'; */
    @IsEnum(PaymentMethod)
    paymentMethod!: PaymentMethod;
}