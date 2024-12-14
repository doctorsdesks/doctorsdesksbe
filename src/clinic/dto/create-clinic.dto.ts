import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
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

  // @IsNumber()
  // followupFee: number;

  // @IsNumber()
  // followupDays: number;

  @IsNumber()
  slotDuration: number;

  @IsArray()
  clinicTimings: EachDayInfo[];

  constructor(
    doctorId: string,
    clinicAddress: ClinicAddress,
    appointmentFee?: number,
    // followupFee?: number,
    // followupDays?: number,
    slotDuration?: number,
    clinicTimings?: EachDayInfo[],
  ) {
    this.doctorId = doctorId;
    this.clinicAddress = clinicAddress;
    this.appointmentFee = appointmentFee || 0;
    // this.followupFee = followupFee || 0;
    // this.followupDays = followupDays || 0;
    this.slotDuration = slotDuration || 5;
    this.clinicTimings = clinicTimings || [];
  }
}
