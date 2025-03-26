import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Gender, UserType } from 'src/common/enums';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/user.service';

export interface PatientSearchResult {
  name: string;
  phone: string;
  age: string;
}

export interface PatientInfoResult {
  phone: string;
  imageUrl: string;
  name: string;
  gender: Gender;
  bloodGroup: string;
  alternatePhone: string;
  maritalStatus: string;
  emailId: string;
  city: string;
  state: string;
  pincode: string;
  age: string;
}

@Injectable()
export class PatientService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    // create user
    const user = new CreateUserDto(
      createPatientDto?.phone,
      createPatientDto?.password,
      UserType.PATIENT,
    );
    const response = await this.userService.createUser(user);
    if (response.status === 'Success') {
      try {
        const dob = new Date(createPatientDto.dob);
        const patient = new this.patientModel({
          phone: createPatientDto.phone,
          imageUrl: createPatientDto.imageUrl,
          name: createPatientDto.name,
          gender: createPatientDto.gender,
          dob: dob,
          bloodGroup: createPatientDto?.bloodGroup || '',
          alternatePhone: createPatientDto?.alternatePhone || '',
          maritalStatus: createPatientDto?.maritalStatus || '',
          emailId: createPatientDto?.emailId || '',
          city: createPatientDto?.city,
          state: createPatientDto?.state,
          pincode: createPatientDto?.pincode,
        });
        const createdPatient = await patient.save();
        return createdPatient;
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException(
            `Patient is already exist with ${createPatientDto.phone}`,
          );
        }
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async getPatientByPhone(phone: string): Promise<PatientInfoResult> {
    try {
      const patient = await this.patientModel.findOne({ phone }).exec();
      if (!patient) {
        throw new HttpException(
          `No patient is found with this ${phone} number`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        phone: patient.phone,
        imageUrl: patient.imageUrl,
        name: patient.name,
        gender: Gender[patient.gender],
        bloodGroup: patient.bloodGroup,
        alternatePhone: patient.alternatePhone,
        maritalStatus: patient.maritalStatus,
        emailId: patient.emailId,
        city: patient.city,
        state: patient.state,
        pincode: patient.pincode,
        age: this.calculateAge(patient.dob).toString(),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePatient(
    phone: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    try {
      const patient = await this.patientModel.findOne({ phone }).exec();
      if (!patient) {
        throw new HttpException(
          `No patient is found with this ${phone} number`,
          HttpStatus.NOT_FOUND,
        );
      }
      patient.imageUrl = updatePatientDto.imageUrl || '';
      patient.alternatePhone = updatePatientDto?.alternatePhone || '';
      patient.maritalStatus = updatePatientDto?.maritalStatus || '';
      patient.emailId = updatePatientDto?.emailId || '';
      patient.city = updatePatientDto?.city;
      patient.state = updatePatientDto?.state;
      patient.pincode = updatePatientDto?.pincode;
      const updatedPatient = await patient.save();
      return updatedPatient;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async getPatientsBySeachText(
    searchString: string,
  ): Promise<PatientSearchResult[]> {
    try {
      // Find patients where searchString is part of phone or name (case insensitive)
      const patients = await this.patientModel
        .find({
          $or: [
            { phone: { $regex: searchString, $options: 'i' } },
            { name: { $regex: searchString, $options: 'i' } },
          ],
        })
        .exec();

      // Transform the results to include calculated age
      return patients.map((patient) => {
        return {
          name: patient.name,
          phone: patient.phone,
          age: this.calculateAge(patient.dob).toString(),
        };
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
