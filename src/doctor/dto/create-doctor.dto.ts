import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';
import { Gender } from 'src/common/enums';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

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
    readonly pincode: string;

    @IsArray()
    @ArrayNotEmpty()
    readonly languages: string[];

    @IsString()
    @IsNotEmpty()
    readonly specialization: string;

    @IsString()
    @IsNotEmpty()
    readonly registrationNumber: string;

    constructor(
        phone: string,
        name: string,
        gender: Gender,
        email: string,
        pincode: string,
        languages: string[],
        specialization: string,
        registrationNumber: string,
    ){
        this.phone = phone;
        this.name = name;
        this.gender = gender;
        this.email = email || "";
        this.pincode = pincode;
        this.languages = languages;
        this.specialization = specialization;
        this.registrationNumber = registrationNumber;
    }
}
