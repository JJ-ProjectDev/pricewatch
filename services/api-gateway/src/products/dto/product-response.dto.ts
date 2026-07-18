import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty({ example: 'cmrqetpqv0000pa4gf6oymc3t' })
  id!: string;

  @ApiProperty({ example: 'Apple iPhone 15 Pro 128GB' })
  name!: string;

  @ApiProperty({
    example:
      'Compact flagship phone with A17 Pro performance, titanium build, and a 48MP main camera.',
  })
  description!: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
    format: 'uri',
  })
  imageUrl!: string;

  @ApiProperty({ example: '2026-07-18T13:35:54.775Z', format: 'date-time' })
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
