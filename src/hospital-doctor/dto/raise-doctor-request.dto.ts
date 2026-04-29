import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RaiseDoctorRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  hospitalId: string;

  @IsString()
  @IsNotEmpty()
  doctorCode: string;

  // optional → if frontend sends doctor name for validation/display
  @IsOptional()
  @IsString()
  doctorName?: string;
}
