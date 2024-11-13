import { Injectable } from '@nestjs/common';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Gender } from 'src/common/enums';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { CreateClinicDto } from 'src/clinic/dto/create-clinic.dto';
import { ClinicService } from 'src/clinic/clinic.service';
import { Clinic } from 'src/clinic/schemas/clinic.schema';
import { DfoService } from 'src/dfo/dfo.service';
import { CreateDfoDto } from 'src/dfo/dto/create-dfo.dto';
import { dfoInitial } from 'src/common/constant';

@Injectable()
export class SignupService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
    private readonly dfoService: DfoService,
  ) {}

  async signupDoctor(signupDoctorDto: SignupDoctorDto): Promise<Doctor> {
    // add new Doctor document
    const newDoctor = await this.createDoctor(signupDoctorDto);

    const doctorId = newDoctor.phone;
    console.info('doctorId for signup: ', doctorId);

    // add new Clinic document of that docId
    const newClinic = await this.createClinic(signupDoctorDto, doctorId);
    console.info(
      `${newDoctor.name}, your doctor account has been created successfully with clinic ${newClinic.clinicAddress.clinicName}`,
    );

    // create a dfo for this doctor with { isClinicTimingSet: false, isClinicFeeSet: false }
    const createDfoDto = new CreateDfoDto(doctorId, dfoInitial);
    this.dfoService.createDfo(createDfoDto);

    return newDoctor;

    // return `${newDoctor.name}, your doctor account has been created successfully with clinic ${newClinic.clinicAddress.clinicName}`;
  }

  async createDoctor(signupDoctorInfo: SignupDoctorDto): Promise<Doctor> {
    const gender = Gender[signupDoctorInfo.gender];
    const pincode = signupDoctorInfo?.clinicAddress?.address?.pincode;

    const createdDoctorDto = new CreateDoctorDto(
      signupDoctorInfo.phone,
      signupDoctorInfo.imageUrl,
      signupDoctorInfo.name,
      gender,
      signupDoctorInfo.email,
      signupDoctorInfo.experience,
      signupDoctorInfo.specialisation,
      signupDoctorInfo.otherQualification,
      signupDoctorInfo.languages,
      pincode,
      signupDoctorInfo.registrationInfo,
      signupDoctorInfo.panInfo,
      signupDoctorInfo.aadharInfo,
    );

    const createdDoctor =
      await this.doctorService.createDoctor(createdDoctorDto);
    console.info(
      'Signup Doctor - signup Service - created doctor :',
      createdDoctor,
    );
    return createdDoctor;
  }

  async createClinic(
    signupDoctorInfo: SignupDoctorDto,
    docId: string,
  ): Promise<Clinic> {
    const createdClinicDto = new CreateClinicDto(
      docId,
      signupDoctorInfo.clinicAddress,
    );
    console.info('createClinitDto :: ', createdClinicDto);
    const createdClinic =
      await this.clinicService.createClinic(createdClinicDto);
    console.info('Signup Doctor - clinic created : ', createdClinic);
    return createdClinic;
  }
}
