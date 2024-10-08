import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail, IsObject } from 'class-validator';
import { Gender } from 'src/common/enums';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { Qualification } from 'src/doctor/schemas/qualification.schema';

export class SignupDoctorDto {
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
    readonly languages: string[];

    @IsString()
    @IsNotEmpty()
    readonly registrationNumber: string;

    @IsObject()
    @IsNotEmpty()
    readonly clinicAddress: ClinicAddress;

    @IsArray()
    @ArrayNotEmpty()
    readonly qualifications: Qualification[];
}
