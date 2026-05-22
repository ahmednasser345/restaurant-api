import { Controller, Post, Delete, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { FollowRestaurantDto } from './dto/follow-restaurant.dto';

@ApiTags('Follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  @ApiOperation({ summary: 'Follow a restaurant' })
  @ApiResponse({ status: 201, description: 'Now following the restaurant' })
  @ApiResponse({ status: 409, description: 'Already following this restaurant' })
  follow(@Body() dto: FollowRestaurantDto) {
    return this.followsService.follow(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Unfollow a restaurant' })
  @ApiResponse({ status: 200, description: 'Unfollowed successfully' })
  @ApiResponse({ status: 404, description: 'Follow relationship not found' })
  unfollow(@Body() dto: FollowRestaurantDto) {
    return this.followsService.unfollow(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all restaurants followed by a user' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  getUserFollows(@Param('userId') userId: string) {
    return this.followsService.getUserFollows(userId);
  }
}
