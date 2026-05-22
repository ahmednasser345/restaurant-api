import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getRecommendations(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const inputUser = await this.userModel.findById(userObjectId).lean();
    if (!inputUser) throw new NotFoundException(`User not found: ${userId}`);

    const pipeline: any[] = [
      {
        $match: {
          _id: { $ne: userObjectId },
          favoriteCuisines: { $in: inputUser.favoriteCuisines },
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'user',
          as: 'userFollows',
        },
      },
      {
        $group: {
          _id: null,
          similarUsers: {
            $push: {
              _id: '$_id',
              fullName: '$fullName',
              favoriteCuisines: '$favoriteCuisines',
            },
          },
          restaurantIdArrays: { $push: '$userFollows.restaurant' },
        },
      },
      {
        $project: {
          _id: 0,
          similarUsers: 1,
          restaurantIds: {
            $reduce: {
              input: '$restaurantIdArrays',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantIds',
          foreignField: '_id',
          as: 'recommendedRestaurants',
        },
      },
      {
        $project: {
          similarUsers: 1,
          recommendedRestaurants: {
            _id: 1,
            nameEn: 1,
            nameAr: 1,
            slug: 1,
            cuisines: 1,
            location: 1,
          },
        },
      },
    ];

    const results = await this.userModel.aggregate(pipeline).exec();

    const emptyResult = {
      inputUser: {
        _id: inputUser._id,
        fullName: inputUser.fullName,
        favoriteCuisines: inputUser.favoriteCuisines,
      },
      similarUsers: [],
      recommendedRestaurants: [],
    };

    if (!results.length) return emptyResult;

    return {
      inputUser: emptyResult.inputUser,
      similarUsers: results[0].similarUsers,
      recommendedRestaurants: results[0].recommendedRestaurants,
    };
  }
}
