import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from 'src/common/enums';

@Schema({ timestamps: true }) // Enable timestamps
export class Patient extends Document {
  @Prop({ type: String, required: true, index: true, unique: true })
  phone: string;

  @Prop({ type: String, default: '' })
  imageUrl: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(Gender), required: true })
  gender: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  // createAt and updatedAt will be added automatically by mongo.
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
