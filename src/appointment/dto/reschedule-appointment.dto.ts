import { IsString, IsNotEmpty } from 'class-validator';
import { AppointmentByType, AppointmentUpdateType } from 'src/common/enums';

export class RescheduleAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly appointmentId: string;

  @IsString()
  @IsNotEmpty()
  readonly appointmentUpdateType: AppointmentUpdateType;

  @IsString()
  @IsNotEmpty()
  readonly date?: string;

  @IsString()
  @IsNotEmpty()
  readonly startTime?: string;

  @IsString()
  @IsNotEmpty()
  readonly endTime?: string;

  @IsString()
  @IsNotEmpty()
  readonly originEntity: AppointmentByType;

  constructor(
    date: string,
    startTime: string,
    endTime: string,
    originEntity: AppointmentByType,
  ) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.originEntity = originEntity;
  }
}
