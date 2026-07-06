import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { DoctorHospitalRole } from 'src/common/enums';

export class UpdateRoleDto {
  @IsMongoId()
  @IsNotEmpty()
  mappingId: string;

  @IsEnum(DoctorHospitalRole)
  role: DoctorHospitalRole;
}
