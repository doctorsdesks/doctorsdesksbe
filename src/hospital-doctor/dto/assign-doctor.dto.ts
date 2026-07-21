import { IsArray, IsEnum, IsMongoId, IsNumber, Min } from 'class-validator';
import { DoctorHospitalRole } from 'src/common/enums';

export class AssignDoctorDto {
  @IsMongoId()
  hospitalId: string;

  @IsMongoId()
  doctorId: string;

  @IsEnum(DoctorHospitalRole)
  role: DoctorHospitalRole;

  @IsNumber()
  @Min(0)
  appointmentFee: number;

  @IsNumber()
  @Min(0)
  emergencyFee: number;

  @IsNumber()
  @Min(5)
  slotDuration: number;

  @IsArray()
  doctorTimings: any[];
}
