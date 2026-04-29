import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { DoctorHospitalRole } from '../schemas/hospital-doctor.schema';

export class UpdateRoleDto {
  @IsMongoId()
  @IsNotEmpty()
  mappingId: string;

  @IsEnum(DoctorHospitalRole)
  role: DoctorHospitalRole;
}
