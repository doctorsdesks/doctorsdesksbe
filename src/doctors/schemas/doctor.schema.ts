import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, UserStatus } from 'src/common/enums';
import { Qualification, QualificationSchema } from './qualification.schema';

@Schema()
export class Doctor extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({ type: String, enum: Object.values(Gender), required: true })
  gender: Gender;

  @Prop({ unique: true, required: true, type: String })
  email: string;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String, required: true })
  currentCity: string;

  // @Prop({ type: String })
  // imageUrl: string;

  @Prop({ type: Date })
  createdOn: Date

  @Prop({ type: Date })
  updatedOn: Date

  @Prop({ type: String })
  specialization: string

  @Prop({ type: String, enum: Object.values(UserStatus), required: true })
  docStatus: UserStatus

  @Prop({ type: [QualificationSchema], default: [] })
  qualifications: Qualification[];

  @Prop({ type: String, required: true })
  registraionNumber: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
