import { IsString, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enums';

export class CreatePatientDto {
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

  @IsString()
  @IsNotEmpty()
  readonly dob: string;

  constructor(
    phone: string,
    imageUrl: string,
    name: string,
    gender: Gender,
    dob: string,
  ) {
    this.phone = phone;
    this.imageUrl = imageUrl || '';
    this.name = name;
    this.gender = gender;
    this.dob = dob;
  }
}
