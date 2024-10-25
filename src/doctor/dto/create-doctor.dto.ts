import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsEmail,
  IsObject,
} from 'class-validator';
import { Gender, Specialisation } from 'src/common/enums';
import { IdInfo } from 'src/common/models/idInfo.model';

export class CreateDoctorDto {
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
  readonly specialisation: Specialisation;

  @IsString()
  @IsNotEmpty()
  readonly qualification: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly languages: string[];

  @IsString()
  @IsNotEmpty()
  readonly pincode: string;

  @IsObject()
  @IsNotEmpty()
  readonly registrationInfo: IdInfo;

  @IsObject()
  readonly panInfo: IdInfo;

  @IsObject()
  readonly aadharInfo: IdInfo;

  constructor(
    phone: string,
    imageUrl: string,
    name: string,
    gender: Gender,
    email: string,
    experience: string,
    specialisation: Specialisation,
    qualification: string,
    languages: string[],
    pincode: string,
    registrationInfo: IdInfo,
    panInfo: IdInfo,
    aadharInfo: IdInfo,
  ) {
    this.phone = phone;
    this.imageUrl = imageUrl;
    this.name = name;
    this.gender = gender;
    this.email = email;
    this.experience = experience;
    this.specialisation = specialisation;
    this.qualification = qualification;
    this.languages = languages;
    this.pincode = pincode;
    this.registrationInfo = registrationInfo;
    this.panInfo = panInfo;
    this.aadharInfo = aadharInfo;
  }
}
