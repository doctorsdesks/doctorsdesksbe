import { Injectable } from '@nestjs/common';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Gender } from 'src/common/enums';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class SignupService {
    constructor(
        private readonly doctorService: DoctorService
    ){}

    async signupDoctor(signupDoctorDto: SignupDoctorDto): Promise<string> {
        // validate otp

        // add new Doctor document
        const newDoctor = this.createDoctor(signupDoctorDto);
        // add new Clinic document of that docId



        // add new Qualification document of that docId

        return newDoctor;
    }

    async createDoctor(signupDoctorInfo: SignupDoctorDto): Promise<string> {
        const gender = Gender[signupDoctorInfo.gender];
        const specialization = signupDoctorInfo.qualifications && signupDoctorInfo.qualifications[1] && signupDoctorInfo.qualifications[1]?.specialization || "";
        const pincode = signupDoctorInfo?.clinicAddress?.address?.pincode;

        const createDoctorDto = new CreateDoctorDto(
            signupDoctorInfo.phone,
            signupDoctorInfo.name,
            gender,
            signupDoctorInfo.email,
            pincode,
            signupDoctorInfo.languages,
            specialization,
            signupDoctorInfo.registrationNumber,
        );

        const createdDoctor = await this.doctorService.createDoctor(createDoctorDto);
        console.info("Signup Doctor - signup Service - created doctor :", createdDoctor);
        return createDoctorDto.name;
    }
}
