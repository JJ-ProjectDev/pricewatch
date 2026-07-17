import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return products.map(ProductResponseDto.fromProduct);
  }
}
