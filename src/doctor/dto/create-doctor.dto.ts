import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';
import { Gender } from 'src/common/enums';
import { IdInfo } from 'src/common/models/idInfo.model';

// Custom validator to enforce non-empty array with at least one non-empty string
@ValidatorConstraint({ name: 'NonEmptyStringArray', async: false })
class NonEmptyStringArrayConstraint implements ValidatorConstraintInterface {
  validate(languages: any, args: ValidationArguments) {
    console.info(args);
    return (
      Array.isArray(languages) &&
      languages.length > 0 &&
      languages.every(
        (lang) => typeof lang === 'string' && lang.trim().length > 0,
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    console.info(args);
    return 'Languages must be a non-empty array of non-empty strings';
  }
}

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
  readonly specialisation: string;

  @IsString()
  readonly otherQualification: string;

  @IsArray()
  @Validate(NonEmptyStringArrayConstraint) // Use custom validator
  readonly languages: string[];

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
    specialisation: string,
    otherQualification: string,
    languages: string[],
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
    this.otherQualification = otherQualification || '';
    this.languages = languages;
    this.registrationInfo = registrationInfo;
    this.panInfo = panInfo;
    this.aadharInfo = aadharInfo;
  }
}
