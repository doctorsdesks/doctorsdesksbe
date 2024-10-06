import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail, IsObject } from 'class-validator';
import { Qualification } from '../schemas/qualification.schema';
import { Gender } from 'src/common/enums';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsString()
    @IsNotEmpty()
    readonly otp: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly gender: Gender;

    @IsEmail()
    readonly email: string;

    @IsArray()
    @ArrayNotEmpty()
    languages: string[];

    @IsString()
    @IsNotEmpty()
    registrationNumber: string;

    @IsObject()
    @IsNotEmpty()
    clinicAddress: ClinicAddress;

    @IsArray()
    @ArrayNotEmpty()
    qualifications: Qualification[];
}
