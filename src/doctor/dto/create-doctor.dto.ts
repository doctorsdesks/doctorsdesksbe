import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';
import { Gender, Specialization } from 'src/common/enums';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    readonly doctorId: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

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

    @IsString()
    @IsNotEmpty()
    readonly pincode: string;

    @IsArray()
    @ArrayNotEmpty()
    readonly languages: string[];

    @IsString()
    @IsNotEmpty()
    readonly registrationNumber: string;

    constructor(
        doctorId: string,
        phone: string,
        email: string,
        name: string,
        gender: Gender,
        specialization: Specialization,
        qualification: string,
        pincode: string,
        languages: string[],
        registrationNumber: string,
    ){
        this.doctorId = doctorId;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.gender = gender;
        this.specialization = specialization;
        this.qualification = qualification;
        this.pincode = pincode;
        this.languages = languages;
        this.registrationNumber = registrationNumber;
    }
}
