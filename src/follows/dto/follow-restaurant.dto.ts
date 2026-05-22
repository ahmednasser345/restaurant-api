import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FollowRestaurantDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User MongoDB ID' })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Restaurant MongoDB ID' })
  @IsMongoId()
  @IsNotEmpty()
  restaurantId: string;
}
