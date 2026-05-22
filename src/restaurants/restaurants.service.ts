import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { FilterRestaurantsDto } from './dto/filter-restaurants.dto';
import { NearbyRestaurantsDto } from './dto/nearby-restaurants.dto';

const NEARBY_RADIUS_METERS = 1000;

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const existing = await this.restaurantModel.findOne({ slug: dto.slug });
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" is already taken`);
    }

    const restaurant = new this.restaurantModel({
      nameEn: dto.nameEn,
      nameAr: dto.nameAr,
      slug: dto.slug,
      cuisines: dto.cuisines,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude], // MongoDB GeoJSON: [lng, lat]
      },
    });

    return restaurant.save();
  }

  async findAll(filter: FilterRestaurantsDto): Promise<Restaurant[]> {
    const query: Record<string, any> = {};
    if (filter.cuisine) {
      query.cuisines = filter.cuisine;
    }
    return this.restaurantModel.find(query).exec();
  }

  async findByIdOrSlug(identifier: string): Promise<Restaurant> {
    let restaurant: Restaurant | null = null;

    if (/^[a-f\d]{24}$/i.test(identifier)) {
      restaurant = await this.restaurantModel.findById(identifier).exec();
    }

    if (!restaurant) {
      restaurant = await this.restaurantModel.findOne({ slug: identifier }).exec();
    }

    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found: ${identifier}`);
    }

    return restaurant;
  }

  async findNearby(dto: NearbyRestaurantsDto): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [dto.longitude, dto.latitude],
            },
            $maxDistance: NEARBY_RADIUS_METERS,
          },
        },
      })
      .exec();
  }
}
