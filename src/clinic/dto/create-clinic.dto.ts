import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { EachDayInfo } from 'src/common/models/eachDayInfo.model';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  readonly doctorId: string;

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
  slotDurationNormal: number;

  @IsNumber()
  @IsOptional()
  slotDurationEmergency: number;

  @IsArray()
  clinicTimingsNormal: EachDayInfo[];

  @IsArray()
  @IsOptional()
  clinicTimingsEmergency: EachDayInfo[];

  constructor(
    doctorId: string,
    clinicAddress: ClinicAddress,
    appointmentFee?: number,
    emergencyFee?: number,
    // followupFee?: number,
    // followupDays?: number,
    slotDurationNormal?: number,
    slotDurationEmergency?: number,
    clinicTimingsNormal?: EachDayInfo[],
    clinicTimingsEmergency?: EachDayInfo[],
  ) {
    this.doctorId = doctorId;
    this.clinicAddress = clinicAddress;
    this.appointmentFee = appointmentFee || 0;
    this.emergencyFee = emergencyFee || 0;
    // this.followupFee = followupFee || 0;
    // this.followupDays = followupDays || 0;
    this.slotDurationNormal = slotDurationNormal || 5;
    this.slotDurationEmergency = slotDurationEmergency || 5;
    this.clinicTimingsNormal = clinicTimingsNormal || [];
    this.clinicTimingsEmergency = clinicTimingsEmergency || [];
  }
}
