import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { FilterRestaurantsDto } from './dto/filter-restaurants.dto';
import { NearbyRestaurantsDto } from './dto/nearby-restaurants.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all restaurants, optionally filtered by cuisine' })
  @ApiResponse({ status: 200, description: 'Array of restaurants' })
  findAll(@Query() filter: FilterRestaurantsDto) {
    return this.restaurantsService.findAll(filter);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find restaurants within 1KM radius using geospatial query' })
  @ApiResponse({ status: 200, description: 'Nearby restaurants within 1KM' })
  findNearby(@Query() dto: NearbyRestaurantsDto) {
    return this.restaurantsService.findNearby(dto);
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get restaurant by MongoDB ID or slug' })
  @ApiParam({ name: 'identifier', description: 'MongoDB ObjectId or slug string' })
  @ApiResponse({ status: 200, description: 'Restaurant details' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('identifier') identifier: string) {
    return this.restaurantsService.findByIdOrSlug(identifier);
  }
}
