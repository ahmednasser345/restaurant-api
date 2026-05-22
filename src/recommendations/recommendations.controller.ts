import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get restaurant recommendations for a user',
    description:
      'Uses a 3-step MongoDB aggregation pipeline: ' +
      '(1) find users sharing the same favorite cuisines, ' +
      '(2) aggregate all restaurants followed by those users, ' +
      '(3) return both lists.',
  })
  @ApiParam({ name: 'userId', description: 'MongoDB ObjectId of the target user' })
  @ApiResponse({ status: 200, description: 'Similar users and recommended restaurants' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getRecommendations(@Param('userId') userId: string) {
    return this.recommendationsService.getRecommendations(userId);
  }
}
