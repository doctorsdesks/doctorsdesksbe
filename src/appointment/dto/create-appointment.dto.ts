import { IsString, IsNotEmpty } from 'class-validator';
import {
  AppointmentByType,
  AppointmentType,
  OPDAppointmentType,
} from 'src/common/enums';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly doctorId: string;

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
  ) {
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.appointmentType = appointmentType;
    this.opdAppointmentType = opdAppointmentType;
    this.originEntity = originEntity;
  }
}
