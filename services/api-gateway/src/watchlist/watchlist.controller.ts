import {
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { WatchlistResponseDto } from './dto/watchlist-response.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access-token-cookie')
  @ApiOperation({ summary: 'Add a product to the authenticated watchlist' })
  @ApiParam({
    name: 'productId',
    description: 'Product identifier',
    example: 'cmrqetpqv0000pa4gf6oymc3t',
  })
  @ApiCreatedResponse({
    description: 'The product was added to the watchlist.',
    type: WatchlistResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The authentication cookie is missing, invalid, or expired.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No product exists with that ID.',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'The product is already on the authenticated watchlist.',
    type: ApiErrorResponseDto,
  })
  create(
    @Request() request: { user: AuthenticatedUser },
    @Param('productId') productId: string,
  ): Promise<WatchlistResponseDto> {
    return this.watchlistService.create(request.user.id, productId);
  }
}
