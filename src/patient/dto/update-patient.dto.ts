import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string;

  @IsString()
  readonly alternatePhone: string;

  @IsString()
  readonly maritalStatus: string;

  @IsString()
  readonly emailId: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly pincode: string;
}
