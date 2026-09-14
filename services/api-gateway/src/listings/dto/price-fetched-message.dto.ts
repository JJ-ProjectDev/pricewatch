import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class PriceFetchedMessageDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @IsString()
  @IsNotEmpty()
  retailer!: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @IsISO8601({ strict: true, strictSeparator: true })
  fetchedAt!: string;
}
