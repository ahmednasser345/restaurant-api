import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray, IsEnum, IsNotEmpty, IsNumber, IsString,
  ArrayMinSize, ArrayMaxSize, Matches,
} from 'class-validator';
import { Cuisine } from '../../common/enums/cuisine.enum';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'The Burger House', description: 'Restaurant name in English' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ example: 'بيت البرجر', description: 'Restaurant name in Arabic' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({ example: 'the-burger-house', description: 'Unique slug (lowercase, hyphens only)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  slug: string;

  @ApiProperty({
    example: ['Burgers', 'American'],
    description: 'List of cuisines (1 to 3)',
    enum: Cuisine,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsEnum(Cuisine, { each: true })
  cuisines: Cuisine[];

  @ApiProperty({ example: 24.7136, description: 'Latitude of the restaurant location' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 46.6753, description: 'Longitude of the restaurant location' })
  @IsNumber()
  longitude: number;
}
