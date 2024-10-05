import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';
import { Qualification } from '../schemas/qualification.schema';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly dob: string;

    @IsString()
    @IsNotEmpty()
    readonly gender: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsArray()
    @ArrayNotEmpty()
    languages: string[];

    @IsString()
    @IsNotEmpty()
    currentCity: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsArray()
    @ArrayNotEmpty()
    qualifications: Qualification[];

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    registrationNumber: string;
}
