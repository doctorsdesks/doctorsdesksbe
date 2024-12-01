import { IsString, IsNotEmpty } from 'class-validator';
import { AppointmentByType, AppointmentUpdateType } from 'src/common/enums';

export class UpdateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly appointmentUpdateType: AppointmentUpdateType;

  @IsString()
  @IsNotEmpty()
  readonly updatedBy: AppointmentByType;
}
