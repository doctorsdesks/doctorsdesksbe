import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AppointmentByType,
  AppointmentStatus,
  AppointmentType,
  OPDAppointmentType,
} from 'src/common/enums';

@Schema({ timestamps: true }) // Enable timestamps
export class Appointment extends Document {
  @Prop({ type: String, required: true, index: true })
  doctorId: string;

  @Prop({ type: String, required: false })
  doctorImageUrl: string;

  @Prop({ type: String, required: false })
  doctorName: string;

  @Prop({ type: String, required: true, index: true })
  patientId: string;

  @Prop({ type: String, required: false })
  patientImageUrl: string;

  @Prop({ type: String, required: false })
  patientName: string;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: String, required: true })
  endTime: string;

  @Prop({ type: String, enum: Object.values(AppointmentType) })
  appointmentType: string;

  @Prop({ type: String, enum: OPDAppointmentType, required: false })
  opdAppointmentType?: OPDAppointmentType;

  @Prop({
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.PENDING,
  })
  status: string;

  @Prop({
    type: String,
    required: false,
  })
  reasonForCancel: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(AppointmentByType),
  })
  createdBy: string;

  @Prop({
    type: String,
    enum: Object.values(AppointmentByType),
    required: false,
  })
  updatedBy?: string;

  @Prop({ type: Boolean, default: false })
  isLockedByDoctor: boolean;

  // createAt and updatedAt will be added automatically by mongo.
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
