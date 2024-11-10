import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsEmail,
  IsObject,
} from 'class-validator';
import { Gender } from 'src/common/enums';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { IdInfo } from 'src/common/models/idInfo.model';

export class SignupDoctorDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  readonly imageUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: Gender;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly experience: string;

  @IsString()
  @IsNotEmpty()
  readonly specialisation: string;

  @IsString()
  readonly otherQualification: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly languages: string[];

  @IsObject()
  @IsNotEmpty()
  readonly clinicAddress: ClinicAddress;

  @IsObject()
  @IsNotEmpty()
  readonly registrationInfo: IdInfo;

  @IsObject()
  readonly panInfo: IdInfo;

  @IsObject()
  readonly aadharInfo: IdInfo;
}
