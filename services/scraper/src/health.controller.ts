import { Controller, Get } from '@nestjs/common';
import { HealthResponseDto } from './health-response.dto';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'scraper',
    };
  }
}
