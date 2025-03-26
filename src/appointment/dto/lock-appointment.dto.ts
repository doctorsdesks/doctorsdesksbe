import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class LockAppointmentDto {
  @IsString()
  @IsNotEmpty()
  readonly doctorId: string;

  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly startTime: string;

  @IsString()
  @IsNotEmpty()
  readonly endTime: string;

  @IsBoolean()
  readonly isLockedByDoctor: boolean;

  constructor(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    isLockedByDoctor: boolean,
  ) {
    this.doctorId = doctorId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isLockedByDoctor = isLockedByDoctor;
  }
}
