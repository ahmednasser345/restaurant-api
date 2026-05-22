import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { FollowRestaurantDto } from './dto/follow-restaurant.dto';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
  ) {}

  async follow(dto: FollowRestaurantDto): Promise<Follow> {
    const existing = await this.followModel.findOne({
      user: dto.userId,
      restaurant: dto.restaurantId,
    });
    if (existing) throw new ConflictException('User already follows this restaurant');

    return new this.followModel({ user: dto.userId, restaurant: dto.restaurantId }).save();
  }

  async unfollow(dto: FollowRestaurantDto): Promise<{ message: string }> {
    const result = await this.followModel.deleteOne({
      user: dto.userId,
      restaurant: dto.restaurantId,
    });
    if (result.deletedCount === 0) throw new NotFoundException('Follow relationship not found');
    return { message: 'Unfollowed successfully' };
  }

  async getUserFollows(userId: string): Promise<Follow[]> {
    return this.followModel.find({ user: userId }).populate('restaurant').exec();
  }
}
