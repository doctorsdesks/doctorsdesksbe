import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps
export class Translation extends Document {
  @Prop({ type: String, required: true, index: true })
  language: string;

  @Prop({ type: Object })
  translation: object;
  // createAt and updatedAt will be added automatically by mongo.
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
