import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Config extends Document {
  @Prop({ type: String, required: true, unique: true })
  type: string;

  @Prop({ type: Object, required: true })
  data: Record<string, any> | any[] | string[];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
