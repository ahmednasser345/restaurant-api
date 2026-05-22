import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cuisine } from '../../common/enums/cuisine.enum';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true, trim: true })
  nameEn: string;

  @Prop({ required: true, trim: true })
  nameAr: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({
    type: [String],
    enum: Object.values(Cuisine),
    required: true,
    validate: {
      validator: (v: string[]) => v.length >= 1 && v.length <= 3,
      message: 'A restaurant must have between 1 and 3 cuisines',
    },
  })
  cuisines: Cuisine[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ slug: 1 }, { unique: true });
RestaurantSchema.index({ cuisines: 1 });
