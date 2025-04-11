import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from 'src/common/enums';
import { BannerData } from 'src/common/interfaces';

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ type: String, enum: Object.values(UserType) })
  userType: string;

  @Prop({ type: Array, default: [] })
  banners: BannerData[];
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
