import { Injectable } from '@nestjs/common';
import { Clinic } from './schemas/clinic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicService {
    constructor(@InjectModel(Clinic.name) private clinicModel: Model<Clinic>) {}

    async createClinic(createClinicDto: CreateClinicDto): Promise<Clinic> {
        const createdClinicSchema = new this.clinicModel(createClinicDto);
        const createdClinic = await createdClinicSchema.save();
        return createdClinic;
    }

    async updateClinic(clinicId: string, updateClinicDto: UpdateClinicDto): Promise<string> {
        // validations
        const updatedClinic = await this.clinicModel.findByIdAndUpdate(clinicId, updateClinicDto ).exec();
        return `${updatedClinic.clinicAddress.clinicName} has been updated successfully.`;

    }

}
