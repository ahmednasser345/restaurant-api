import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Cuisine } from '../../common/enums/cuisine.enum';

export class FilterRestaurantsDto {
  @ApiPropertyOptional({ enum: Cuisine, description: 'Filter restaurants by cuisine type' })
  @IsOptional()
  @IsEnum(Cuisine)
  cuisine?: Cuisine;
}
