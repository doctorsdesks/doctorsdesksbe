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

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const dob = new Date(createPatientDto.dob);
      const patient = new this.patientModel({
        phone: createPatientDto.phone,
        imageUrl: createPatientDto.imageUrl,
        name: createPatientDto.name,
        gender: createPatientDto.gender,
        dob: dob,
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

  async getPatientByPhone(phone: string): Promise<Patient> {
    try {
      const patient = await this.patientModel.findOne({ phone }).exec();
      if (!patient) {
        throw new HttpException(
          `No patient is found with this ${phone} number`,
          HttpStatus.NOT_FOUND,
        );
      }
      return patient;
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
      const updatedPatient = await patient.save();
      return updatedPatient;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
