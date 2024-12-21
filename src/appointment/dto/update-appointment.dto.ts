import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { AppointmentByType, AppointmentUpdateType } from 'src/common/enums';

export class UpdateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly appointmentUpdateType: AppointmentUpdateType;

  @IsOptional()
  @IsString()
  readonly reasonForCancel: string;

  @IsString()
  @IsNotEmpty()
  readonly updatedBy: AppointmentByType;
}
