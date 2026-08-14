import { ApiProperty } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile-response.dto';

export class LoginResponseDto {
  @ApiProperty({ type: UserProfileResponseDto })
  user!: UserProfileResponseDto;
}
