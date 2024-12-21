import {
  IsString,
  IsArray,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsOptional,
} from 'class-validator';

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

export class UpdateDoctorDto {
  @IsString()
  @IsNotEmpty()
  readonly experience: string;

  @IsOptional()
  @IsString()
  readonly specialisation: string;

  @IsOptional()
  @IsString()
  readonly specialisationCollege: string;

  @IsOptional()
  @IsString()
  readonly specialisationYear: string;

  @IsOptional()
  @IsString()
  readonly otherQualification: string;

  @IsArray()
  @Validate(NonEmptyStringArrayConstraint) // Use custom validator
  readonly languages: string[];

  @IsString()
  readonly imageUrl: string;
}
