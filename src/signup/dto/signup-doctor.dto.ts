import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail, IsObject } from 'class-validator';
import { Gender, Specialization } from 'src/common/enums';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';

export class SignupDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly otp: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly gender: Gender;

    @IsString()
    @IsNotEmpty()
    readonly specialization: Specialization;

    @IsString()
    @IsNotEmpty()
    readonly qualification: string;

    @IsArray()
    @ArrayNotEmpty()
    readonly languages: string[];

    @IsString()
    @IsNotEmpty()
    readonly registrationNumber: string;

    @IsObject()
    @IsNotEmpty()
    readonly clinicAddress: ClinicAddress;
}
