import { Product } from '@prisma/client';

export class ProductResponseDto {
  id!: string;
  name!: string;
  description!: string;
  imageUrl!: string;
  createdAt!: Date;

  static fromProduct(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
    };
  }
}
