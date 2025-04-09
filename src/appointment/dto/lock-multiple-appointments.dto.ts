import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { LockAppointmentDto } from './lock-appointment.dto';

export class LockMultipleAppointmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LockAppointmentDto)
  readonly appointments: LockAppointmentDto[];

  constructor(appointments: LockAppointmentDto[]) {
    this.appointments = appointments;
  }
}
