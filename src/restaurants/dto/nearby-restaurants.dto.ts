import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyRestaurantsDto {
  @ApiProperty({ example: 24.7136, description: 'Latitude of the search center point' })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: 46.6753, description: 'Longitude of the search center point' })
  @IsNumber()
  @Type(() => Number)
  longitude: number;
}
