import { Injectable } from '@nestjs/common';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Gender } from 'src/common/enums';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { CreateClinicDto } from 'src/clinic/dto/create-clinic.dto';
import { ClinicService } from 'src/clinic/clinic.service';

@Injectable()
export class SignupService {
    constructor(
        private readonly doctorService: DoctorService,
        private readonly clinicService: ClinicService
    ){}

    async signupDoctor(signupDoctorDto: SignupDoctorDto): Promise<string> {
        // validate otp

        // add new Doctor document
        const newDoctor = await this.createDoctor(signupDoctorDto);

        // add new Clinic document of that docId
        const docId = newDoctor.id;
        console.info("docId for signup: ", docId);
        this.createClinic(signupDoctorDto, docId);


        // add new Qualification document of that docId

        return newDoctor.name;
    }

    async createDoctor(signupDoctorInfo: SignupDoctorDto): Promise<Doctor> {
        const gender = Gender[signupDoctorInfo.gender];
        const specialization = signupDoctorInfo.qualifications && signupDoctorInfo.qualifications[1] && signupDoctorInfo.qualifications[1]?.specialization || "";
        const pincode = signupDoctorInfo?.clinicAddress?.address?.pincode;

        const createdDoctorDto = new CreateDoctorDto(
            signupDoctorInfo.phone,
            signupDoctorInfo.name,
            gender,
            signupDoctorInfo.email,
            pincode,
            signupDoctorInfo.languages,
            specialization,
            signupDoctorInfo.registrationNumber,
        );

        const createdDoctor = await this.doctorService.createDoctor(createdDoctorDto);
        console.info("Signup Doctor - signup Service - created doctor :", createdDoctor);
        return createdDoctor;
    }

    createClinic(signupDoctorInfo: SignupDoctorDto, docId: string) {
        const createdClinicDto = new CreateClinicDto(
            docId,
            signupDoctorInfo.clinicAddress,
        )
        console.info("createClinitDto :: ", createdClinicDto);
        const createdClinic = this.clinicService.createClinic(createdClinicDto);
        console.info("Signup Doctor - clinic created : ", createdClinic);
    }
}
