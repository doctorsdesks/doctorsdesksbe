import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps
export class ContactUs extends Document {
  @Prop({ type: String, required: true, index: true })
  phone: string;

  @Prop({ type: String, required: true })
  name: boolean;

  @Prop({ type: String, required: true })
  email: boolean;

  @Prop({ type: String, required: true })
  message: boolean;

  // createAt and updatedAt will be added automatically by mongo.
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
