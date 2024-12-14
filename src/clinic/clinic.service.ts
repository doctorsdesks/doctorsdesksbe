import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Clinic } from './schemas/clinic.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';

@Injectable()
export class ClinicService {
  constructor(@InjectModel(Clinic.name) private clinicModel: Model<Clinic>) {}

  async createClinic(createClinicDto: CreateClinicDto): Promise<Clinic> {
    const createdClinicSchema = new this.clinicModel(createClinicDto);
    const createdClinic = await createdClinicSchema.save();
    return createdClinic;
  }

  async addClinicToDoctor(
    doctorId: string,
    clinicData: Partial<CreateClinicDto>,
  ): Promise<string> {
    const createdClinicDto = new CreateClinicDto(
      doctorId,
      clinicData.clinicAddress,
      clinicData?.appointmentFee,
      clinicData?.slotDuration,
      clinicData?.clinicTimings,
    );
    const createdClinic = await this.createClinic(createdClinicDto);
    return `${createdClinic.clinicAddress.clinicName} has been added successfully!`;
  }

  async getAllClinics(doctorId: string): Promise<Clinic[]> {
    try {
      const allClinics = await this.clinicModel.find({ doctorId }).exec();
      if (allClinics?.length > 0) return allClinics;
      else return null;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getClinic(doctorId: string, clinicId: string): Promise<Clinic> {
    try {
      const clinicDetails = await this.clinicModel
        .findOne({ doctorId, _id: new Types.ObjectId(clinicId) })
        .exec();
      if (clinicDetails !== null) return clinicDetails;
      else return null;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateClinic(
    doctorId: string,
    clinicId: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<string> {
    // validations
    const currentClinic = await this.clinicModel
      .findOne({ doctorId, _id: new Types.ObjectId(clinicId) })
      .exec();

    try {
      // update clinic data
      const updatedClinic = await this.updateClinicInfo(
        updateClinicDto,
        currentClinic,
      );
      return `${updatedClinic.clinicAddress.clinicName} has been updated successfully.`;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateClinicInfo(
    updateClinicData: UpdateClinicDto,
    currentClinic: Clinic,
  ): Promise<Clinic> {
    try {
      // update address if it is coming
      if (updateClinicData?.addressPayload) {
        const addressObject = new ClinicAddress(
          updateClinicData?.addressPayload?.clinicName,
          updateClinicData?.addressPayload?.address,
        );
        const validateErrors = addressObject.validate();
        if (validateErrors?.length > 0) {
          throw new HttpException(
            'Invalid request body',
            HttpStatus.BAD_REQUEST,
          );
        }
        currentClinic.clinicAddress = updateClinicData?.addressPayload;
      }
      // update fee and followup related info if present
      if (updateClinicData?.feeFollowupPayload) {
        currentClinic.appointmentFee =
          updateClinicData?.feeFollowupPayload?.appointmentFee;
        // currentClinic.followupDays =
        //   updateClinicData?.feeFollowupPayload?.followupDays;
        // currentClinic.followupFee =
        //   updateClinicData?.feeFollowupPayload?.followupFee;
      }
      // update slot duration and timings if present
      if (updateClinicData?.timingPayload) {
        currentClinic.slotDuration =
          updateClinicData?.timingPayload?.slotDuration;
        currentClinic.clinicTimings =
          updateClinicData?.timingPayload?.eachDayInfo;
      }
      const updatedClinic = await currentClinic.save();
      return updatedClinic;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteClinic(doctorId: string, clinicId: string): Promise<string> {
    try {
      const deletedResponse = await this.clinicModel
        .findOneAndDelete({ doctorId, _id: new Types.ObjectId(clinicId) })
        .exec();
      return `${deletedResponse.clinicAddress.clinicName} clinic has been deleted successfully.`;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
