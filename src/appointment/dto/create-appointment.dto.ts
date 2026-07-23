import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import {
  AppointmentByType,
  AppointmentType,
  OPDAppointmentType,
} from 'src/common/enums';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly doctorId: string;

  @IsOptional()
  @IsString()
  readonly hospitalId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  readonly hospitalDoctorMappingId?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly patientId: string;

  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly startTime: string;

  @IsString()
  @IsNotEmpty()
  readonly endTime: string;

  @IsString()
  @IsNotEmpty()
  readonly appointmentType: AppointmentType;

  @IsString()
  readonly opdAppointmentType?: OPDAppointmentType;

  @IsString()
  @IsNotEmpty()
  readonly originEntity: AppointmentByType;

  constructor(
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string,
    appointmentType: AppointmentType,
    opdAppointmentType: OPDAppointmentType,
    originEntity: AppointmentByType,
    hospitalId?: Types.ObjectId,
    hospitalDoctorMappingId?: Types.ObjectId,
  ) {
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.appointmentType = appointmentType;
    this.opdAppointmentType = opdAppointmentType;
    this.originEntity = originEntity;
    this.hospitalId = hospitalId;
    this.hospitalDoctorMappingId = hospitalDoctorMappingId;
  }
}
