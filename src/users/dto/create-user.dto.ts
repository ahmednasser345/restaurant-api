import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Cuisine } from '../../common/enums/cuisine.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Nasser', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: ['Burgers', 'Asian'],
    description: 'Preferred cuisine types',
    enum: Cuisine,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Cuisine, { each: true })
  favoriteCuisines?: Cuisine[];
}
