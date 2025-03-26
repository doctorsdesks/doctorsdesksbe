import { IsString, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enums';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

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

  @IsString()
  readonly bloodGroup: string;

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

  constructor(
    phone: string,
    password: string,
    imageUrl: string,
    name: string,
    gender: Gender,
    dob: string,
    bloodGroup: string,
    alternatePhone: string,
    maritalStatus: string,
    emailId: string,
    city: string,
    state: string,
    pincode: string,
  ) {
    this.phone = phone;
    this.password = password;
    this.imageUrl = imageUrl || '';
    this.name = name;
    this.gender = gender;
    this.dob = dob;
    this.bloodGroup = bloodGroup || '';
    this.alternatePhone = alternatePhone || '';
    this.maritalStatus = maritalStatus || '';
    this.emailId = emailId || '';
    this.city = city;
    this.state = state;
    this.pincode = pincode;
  }
}
