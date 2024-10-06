import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, Specialization, UserStatus } from 'src/common/enums';

@Schema({ timestamps: true }) // Enable timestamps
export class Doctor extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(Gender), required: true })
  gender: string;

  @Prop({ unique: true, default: "", type: String })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ type: String, required: true })
  pincode: string;

  @Prop({ type: String })
  specialization: Specialization;

  @Prop({ type: String, enum: Object.values(UserStatus), default: UserStatus.NOT_VERIFIED })
  docStatus: UserStatus;

  @Prop({ type: String, required: true })
  registrationNumber: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
