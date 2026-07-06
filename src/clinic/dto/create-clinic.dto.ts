import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { EachDayInfo } from 'src/common/models/eachDayInfo.model';

export class CreateClinicDto {
  @IsNotEmpty()
  readonly doctorId: Types.ObjectId;

  @IsOptional()
  readonly hospitalId?: Types.ObjectId;

  @IsOptional()
  readonly hospitalDoctorMappingId?: Types.ObjectId;

  @IsObject()
  @IsNotEmpty()
  readonly clinicAddress: ClinicAddress;

  @IsNumber()
  appointmentFee: number;

  @IsOptional()
  @IsNumber()
  emergencyFee: number;

  // @IsNumber()
  // followupFee: number;

  // @IsNumber()
  // followupDays: number;

  @IsNumber()
  slotDuration: number;

  @IsArray()
  clinicTimings: EachDayInfo[];

  constructor(
    doctorId: Types.ObjectId,
    clinicAddress: ClinicAddress,
    appointmentFee?: number,
    emergencyFee?: number,
    // followupFee?: number,
    // followupDays?: number,
    slotDuration?: number,
    clinicTimings?: EachDayInfo[],
    hospitalId?: Types.ObjectId,
    hospitalDoctorMappingId?: Types.ObjectId,
  ) {
    this.doctorId = doctorId;
    this.clinicAddress = clinicAddress;
    this.appointmentFee = appointmentFee || 0;
    this.emergencyFee = emergencyFee || 0;
    // this.followupFee = followupFee || 0;
    // this.followupDays = followupDays || 0;
    this.slotDuration = slotDuration || 5;
    this.clinicTimings = clinicTimings || [];
    this.hospitalId = hospitalId;
    this.hospitalDoctorMappingId = hospitalDoctorMappingId;
  }
}
