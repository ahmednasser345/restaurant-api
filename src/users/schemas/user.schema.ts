import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cuisine } from '../../common/enums/cuisine.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({
    type: [String],
    enum: Object.values(Cuisine),
    default: [],
  })
  favoriteCuisines: Cuisine[];
}

export const UserSchema = SchemaFactory.createForClass(User);
