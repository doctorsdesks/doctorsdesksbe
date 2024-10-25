import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { EachDayInfo } from 'src/common/models/eachDayInfo.model';

@Schema({ timestamps: true })
export class Clinic extends Document {
  @Prop({ type: String, required: true })
  doctorId: string;

  @Prop({ type: ClinicAddress, required: true })
  clinicAddress: ClinicAddress;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Please save appointment fee. Mininum is 0'],
  })
  appointmentFee: number;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Please save followup fee. Minimum is 0'],
  })
  followupFee: number;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Please save followup days. Minimum is 0'],
  })
  followupDays: number;

  @Prop({
    type: Number,
    required: true,
    min: [5, 'Slot Duration must be at least 5 min.'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integar value',
    },
  })
  slotDuration: number;

  @Prop({ type: [EachDayInfo], default: [] })
  clinicTimings: EachDayInfo[];
}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
