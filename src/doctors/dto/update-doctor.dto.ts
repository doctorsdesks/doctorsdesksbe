import { IsString, IsArray, ArrayNotEmpty, IsBoolean, IsOptional, IsEmail } from 'class-validator';

export class UpdateDoctorDto {
    @IsString()
    @IsOptional()
    readonly firstName?: string;

    @IsString()
    @IsOptional()
    readonly lastName?: string;

    @IsString()
    @IsOptional()
    readonly dob?: string;

    @IsString()
    @IsOptional()
    readonly gender?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsArray()
    @IsOptional()
    @ArrayNotEmpty()
    languages?: string[];

    @IsString()
    @IsOptional()
    readonly phone?: string;

    @IsBoolean()
    @IsOptional()
    isVerified: boolean = false; // default value as false if not provided

    @IsBoolean()
    @IsOptional()
    isActive: boolean = false; // default value as false if not provided
}
