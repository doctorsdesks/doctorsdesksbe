import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { LockAppointmentDto } from './lock-appointment.dto';
import { UnblockSlotDto } from './unblock-slot.dto';

export class LockMultipleAppointmentsDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LockAppointmentDto)
  readonly appointments?: LockAppointmentDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UnblockSlotDto)
  readonly unblockSlots?: UnblockSlotDto[];

  constructor(
    appointments?: LockAppointmentDto[],
    unblockSlots?: UnblockSlotDto[],
  ) {
    this.appointments = appointments;
    this.unblockSlots = unblockSlots;
  }
}
