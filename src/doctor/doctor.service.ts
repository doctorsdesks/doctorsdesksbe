import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    console.info(
      'Signup Doctor - doctor service - create doctor called with: ',
      createDoctorDto,
    );
    try {
      const newDoctor = new this.doctorModel(createDoctorDto);
      const createdDoctor = await newDoctor.save();
      return createdDoctor;
    } catch (error) {
      console.info('eroor while creating doctor', error);
      if (error.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new ConflictException(
          `Account is already exist with ${createDoctorDto.phone}`,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findByPhone(phone: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findOne({ phone }).exec();
    if (!doctor) {
      return null;
      // throw new HttpException(
      //   `No doctor is found with this ${phone}`,
      //   HttpStatus.NOT_FOUND,
      // );
    }
    return doctor;
  }

  async update(
    doctorId: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    try {
      const doctor = await this.doctorModel.findOne({ phone: doctorId }).exec();
      if (!doctor) {
        throw new HttpException(
          `No doctor is found with this ${doctorId}`,
          HttpStatus.NOT_FOUND,
        );
      }
      doctor.experience = updateDoctorDto.experience;
      doctor.specialisation = updateDoctorDto.specialisation;
      doctor.otherQualification = updateDoctorDto.otherQualification;
      doctor.languages = updateDoctorDto.languages;
      doctor.imageUrl = updateDoctorDto?.imageUrl || '';
      const updatedDoctor = await doctor.save();
      return updatedDoctor;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
