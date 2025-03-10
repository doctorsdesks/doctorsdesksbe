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
import { Address } from 'src/common/models/address.model';

export interface PatientSearchResult {
  name: string;
  phone: string;
  age: string;
}

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
        bloodGroup: createPatientDto?.bloodGroup || '',
        alternatePhone: createPatientDto?.alternatePhone || '',
        maritalStatus: createPatientDto?.maritalStatus || '',
        emailId: createPatientDto?.emailId || '',
        address: createPatientDto?.address || new Address('', '', '', '', ''),
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
      patient.alternatePhone = updatePatientDto?.alternatePhone || '';
      patient.maritalStatus = updatePatientDto?.maritalStatus || '';
      patient.emailId = updatePatientDto?.emailId || '';
      patient.address =
        updatePatientDto?.address || new Address('', '', '', '', '');
      const updatedPatient = await patient.save();
      return updatedPatient;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
        // Calculate age based on dob
        const today = new Date();
        const birthDate = new Date(patient.dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred yet this year
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return {
          name: patient.name,
          phone: patient.phone,
          age: age.toString(),
        };
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
