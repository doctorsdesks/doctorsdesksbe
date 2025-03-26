import { Injectable } from '@nestjs/common';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Gender, UserType } from 'src/common/enums';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { CreateClinicDto } from 'src/clinic/dto/create-clinic.dto';
import { ClinicService } from 'src/clinic/clinic.service';
import { Clinic } from 'src/clinic/schemas/clinic.schema';
import { DfoService } from 'src/dfo/dfo.service';
import { CreateDfoDto } from 'src/dfo/dto/create-dfo.dto';
import { dfoInitial } from 'src/common/constant';
import { UserService } from 'src/users/user.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class SignupService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly userService: UserService,
    private readonly clinicService: ClinicService,
    private readonly dfoService: DfoService,
  ) {}

  async signupDoctor(signupDoctorDto: SignupDoctorDto): Promise<Doctor> {
    // add new user as doctor
    const user = new CreateUserDto(
      signupDoctorDto?.phone,
      signupDoctorDto?.password,
      UserType.DOCTOR,
    );
    const response = await this.userService.createUser(user);
    if (response.status === 'Success') {
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
    }
  }

  async createDoctor(signupDoctorInfo: SignupDoctorDto): Promise<Doctor> {
    const gender = Gender[signupDoctorInfo.gender];

    const createdDoctorDto = new CreateDoctorDto(
      signupDoctorInfo.phone,
      signupDoctorInfo.imageUrl,
      signupDoctorInfo.name,
      gender,
      signupDoctorInfo.dob,
      signupDoctorInfo.email,
      signupDoctorInfo.experience,
      signupDoctorInfo.graduation,
      signupDoctorInfo.graduationCollege,
      signupDoctorInfo.graduationYear,
      signupDoctorInfo.specialisation || '',
      signupDoctorInfo.specialisationCollege || '',
      signupDoctorInfo.specialisationYear || '',
      signupDoctorInfo.otherQualification || '',
      signupDoctorInfo.languages,
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
