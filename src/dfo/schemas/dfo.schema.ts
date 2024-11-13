import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps
export class Dfo extends Document {
  @Prop({ type: String, required: true, index: true, unique: true })
  doctorId: string;

  @Prop({ type: Object, default: {} })
  dfo: object;
}

export const DfoSchema = SchemaFactory.createForClass(Dfo);
