import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { Address } from 'src/common/models/address.model';
import { EachDayInfo } from 'src/common/models/eachDayInfo.model';

@Schema({ timestamps: true })
export class Clinic extends Document {
    @Prop({ type: String, required: true })
    docId: string;

    @Prop({ type: String, required: true })
    clinicName: string;

    @Prop({ type: Address, required: true })
    clinicAddress: Address;

    @Prop({ type: [EachDayInfo], required: true })
    clinicTimings: EachDayInfo[];

    @Prop({ type: Number, required: true, min: [5, 'Slot Duration must be at least 5 min.'], validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integar value',
    } })
    slotDuration: number;

    @Prop({ type: String, default: "" })
    clinicPhone: string;

    @Prop({ type: Number, required: true, min: [0, 'Please save appointment fee. Mininum is 0'] })
    appointmentFee: number;

    @Prop({ type: Number, required: true, min: [0, 'Please save followup fee. Minimum is 0'] })
    followup: number;

    @Prop({ type: Number, required: true, min: [0, 'Please save followup days. Minimum is 0'] })
    followupDays: number;

}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);