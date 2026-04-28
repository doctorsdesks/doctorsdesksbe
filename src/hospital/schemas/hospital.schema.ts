import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address } from 'src/common/models/address.model';

@Schema({ timestamps: true }) // Enable timestamps
export class Hospital extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  phone: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, default: '' })
  email: string;

  @Prop({ type: Address, required: true })
  address: Address;

  // createAt and updatedAt will be added automatically by mongo.
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);
