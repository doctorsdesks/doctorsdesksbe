import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { DoctorHospitalRole, RequestStatus } from 'src/common/enums';

@Schema({ timestamps: true })
export class HospitalDoctor extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  })
  hospitalId: string;

  @Prop({
    type: String,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING,
  })
  requestStatus: RequestStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  })
  doctorId: string;

  @Prop({
    type: String,
    enum: Object.values(DoctorHospitalRole),
    required: true,
  })
  role: DoctorHospitalRole;

  @Prop({
    type: Boolean,
    default: false,
  })
  isActive: boolean;
}

export const HospitalDoctorSchema =
  SchemaFactory.createForClass(HospitalDoctor);

HospitalDoctorSchema.index({ hospitalId: 1, doctorId: 1 }, { unique: true });
