import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, PatientType } from 'src/common/enums';

@Schema({ timestamps: true }) // Enable timestamps
export class Patient extends Document {
  @Prop({
    type: String,
    enum: Object.values(PatientType),
    default: PatientType.PRIMARY,
  })
  type: string;

  @Prop({ type: String, default: null })
  familyMemberOf: string;

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

  @Prop({ type: String, default: '' })
  bloodGroup: string;

  @Prop({ type: String, default: '' })
  alternatePhone: string;

  @Prop({ type: String, default: '' })
  maritalStatus: string;

  @Prop({ type: String, default: '' })
  emailId: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  pincode: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
