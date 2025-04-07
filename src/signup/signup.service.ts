import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      // Step 1: Create a user
      const user = new CreateUserDto(
        signupDoctorDto?.phone,
        signupDoctorDto?.password,
        UserType.DOCTOR,
      );
      const userResponse = await this.userService.createUser(user);

      if (userResponse.status !== 'Success') {
        console.error('Failed to create user account:', userResponse);
        throw new HttpException(
          'Failed to create user account',
          HttpStatus.BAD_REQUEST,
        );
      }

      try {
        // Step 2: Create a doctor
        const newDoctor = await this.createDoctor(signupDoctorDto);
        const doctorId = newDoctor.phone;
        console.info('doctorId for signup: ', doctorId);

        try {
          // Step 3: Create a clinic
          const newClinic = await this.createClinic(signupDoctorDto, doctorId);
          console.info(
            `${newDoctor.name}, your doctor account has been created successfully with clinic ${newClinic.clinicAddress.clinicName}`,
          );

          try {
            // Step 4: Create a DFO
            const createDfoDto = new CreateDfoDto(doctorId, dfoInitial);
            await this.dfoService.createDfo(createDfoDto);

            return newDoctor;
          } catch (dfoError) {
            // Rollback: Delete clinic
            console.error('Error creating DFO, rolling back:', dfoError);
            await this.clinicService.deleteClinic(
              doctorId,
              newClinic._id.toString(),
            );

            // Rollback: Delete doctor
            await this.doctorService.deleteDoctor(doctorId);

            // Rollback: Delete user
            await this.userService.deleteUser(doctorId, UserType.DOCTOR);

            throw dfoError;
          }
        } catch (clinicError) {
          // Rollback: Delete doctor
          console.error('Error creating clinic, rolling back:', clinicError);
          await this.doctorService.deleteDoctor(doctorId);

          // Rollback: Delete user
          await this.userService.deleteUser(doctorId, UserType.DOCTOR);

          throw clinicError;
        }
      } catch (doctorError) {
        // Rollback: Delete user
        console.error('Error creating doctor, rolling back:', doctorError);
        await this.userService.deleteUser(
          signupDoctorDto.phone,
          UserType.DOCTOR,
        );

        throw doctorError;
      }
    } catch (error) {
      console.error('Error in doctor signup process:', error);
      throw new HttpException(
        'Error in doctor signup process',
        HttpStatus.BAD_REQUEST,
      );
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
