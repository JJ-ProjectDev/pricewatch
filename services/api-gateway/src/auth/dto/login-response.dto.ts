import { ApiProperty } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT used to authenticate protected requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({ type: UserProfileResponseDto })
  user!: UserProfileResponseDto;
}
