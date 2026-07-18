import { ApiProperty } from '@nestjs/swagger';
import { SafeUser } from '../auth.types';

export class RegisterUserResponseDto implements SafeUser {
  @ApiProperty({
    example: 'e9ec9a64-a1fe-48c1-9d1e-513dc9d763ee',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'jane@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'janedoe' })
  displayName!: string;

  @ApiProperty({ example: '2026-07-18T13:35:54.775Z', format: 'date-time' })
  createdAt!: Date;
}
