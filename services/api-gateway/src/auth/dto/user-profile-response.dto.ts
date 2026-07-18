import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    example: 'e9ec9a64-a1fe-48c1-9d1e-513dc9d763ee',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'testuser@pricewatch.dev', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'Test User' })
  displayName!: string;
}
