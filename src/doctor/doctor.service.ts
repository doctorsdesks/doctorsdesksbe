import { ConflictException, Injectable } from '@nestjs/common';
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
      throw error;
    }
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findByPhone(id: string): Promise<Doctor> {
    console.info('finding doctor by docID', id);
    const doctor = await this.doctorModel.findOne({ phone: id }).exec();
    if (!doctor) {
      return null;
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.doctorModel.deleteOne({ _id: id }).exec();
  }
}
