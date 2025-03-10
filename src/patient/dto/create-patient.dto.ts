import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { Gender } from 'src/common/enums';
import { Address } from 'src/common/models/address.model';

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

  @IsString()
  readonly bloodGroup: string;

  @IsString()
  readonly alternatePhone: string;

  @IsString()
  readonly maritalStatus: string;

  @IsString()
  readonly emailId: string;

  @IsObject()
  readonly address: Address;

  constructor(
    phone: string,
    imageUrl: string,
    name: string,
    gender: Gender,
    dob: string,
    bloodGroup: string,
    alternatePhone: string,
    maritalStatus: string,
    emailId: string,
    address: Address,
  ) {
    this.phone = phone;
    this.imageUrl = imageUrl || '';
    this.name = name;
    this.gender = gender;
    this.dob = dob;
    this.bloodGroup = bloodGroup || '';
    this.alternatePhone = alternatePhone || '';
    this.maritalStatus = maritalStatus || '';
    this.emailId = emailId || '';
    this.address = address || new Address('', '', '', '', '');
  }
}
