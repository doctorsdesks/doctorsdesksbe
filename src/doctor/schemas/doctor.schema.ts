import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, UserStatus } from 'src/common/enums';
import { IdInfo } from 'src/common/models/idInfo.model';

@Schema({ timestamps: true }) // Enable timestamps
export class Doctor extends Document {
  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, default: '' })
  imageUrl: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(Gender), required: true })
  gender: string;

  @Prop({ type: String, default: '' })
  email: string;

  @Prop({ type: String, required: true, default: '0' })
  experience: string;

  @Prop({ type: String, required: true })
  specialisation: string;

  @Prop({ type: String, default: '' })
  otherQualification: string;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ type: String, required: true })
  pincode: string;

  @Prop({ type: IdInfo, required: true })
  registrationInfo: IdInfo;

  @Prop({ type: IdInfo, required: false })
  panInfo: IdInfo;

  @Prop({ type: IdInfo, required: false })
  aadharInfo: IdInfo;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.NOT_VERIFIED,
  })
  docStatus: UserStatus;

  // createAt and updatedAt will be added automatically by mongo.
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
