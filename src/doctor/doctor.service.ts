import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Gender, Specialization } from 'src/common/enums';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctorDetails = {
      ...createDoctorDto,
      gender: Gender[createDoctorDto.gender],
      pincode: createDoctorDto.clinicAddress?.address?.pincode,
      specialization: createDoctorDto.qualifications[1]?.specialization, 
    }
    console.info("doctorCreatedObject Created :", doctorDetails);
    const createdDoctor = new this.doctorModel(doctorDetails);
    console.info("doctorCreated :", createdDoctor);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor> {
    return this.doctorModel.findById(id).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.doctorModel.deleteOne({ _id: id }).exec();
  }
}
