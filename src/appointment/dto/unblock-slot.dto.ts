import { IsString, IsNotEmpty } from 'class-validator';

export class UnblockSlotDto {
  @IsString()
  @IsNotEmpty()
  readonly appointmentId: string;

  constructor(appointmentId: string) {
    this.appointmentId = appointmentId;
  }
}
