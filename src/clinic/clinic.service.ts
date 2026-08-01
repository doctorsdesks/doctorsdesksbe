import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Clinic } from './schemas/clinic.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { EachDayInfo } from 'src/common/models/eachDayInfo.model';
import { DfoService } from 'src/dfo/dfo.service';
import {
  NotificationActionCategory,
  NotificationCategory,
  UserType,
} from 'src/common/enums';
import { NotificationTokenService } from 'src/notificationToken/notification-token.service';

@Injectable()
export class ClinicService {
  constructor(
    @InjectModel(Clinic.name) private clinicModel: Model<Clinic>,
    private readonly dfoService: DfoService,
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  async createClinic(createClinicDto: CreateClinicDto): Promise<Clinic> {
    const createdClinicSchema = new this.clinicModel(createClinicDto);
    const createdClinic = await createdClinicSchema.save();
    return createdClinic;
  }

  async addClinicToDoctor(
    doctorId: Types.ObjectId,
    clinicData: Partial<CreateClinicDto>,
  ): Promise<string> {
    const createdClinicDto = new CreateClinicDto(
      doctorId,
      clinicData.clinicAddress,
      clinicData?.appointmentFee,
      clinicData?.emergencyFee,
      clinicData?.slotDuration,
      clinicData?.clinicTimings,
    );
    const createdClinic = await this.createClinic(createdClinicDto);
    return `${createdClinic.clinicAddress.clinicName} has been added successfully!`;
  }

  async getAllClinics(doctorId: string): Promise<Clinic[]> {
    try {
      const allClinics = await this.clinicModel
        .find({ doctorId })
        .populate({
          path: 'hospitalId',
          select: 'hospitalName phone',
        })
        .exec();
      if (allClinics?.length > 0) return allClinics;
      else return null;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getHospitalClinic(
    doctorId: string,
    hospitalId: string,
  ): Promise<Clinic> {
    try {
      const clinic = await this.clinicModel
        .findOne({
          doctorId,
          hospitalId,
        })
        .exec();

      return clinic;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  async getClinic(clinicId: string): Promise<Clinic> {
    try {
      const clinicDetails = await this.clinicModel
        .findOne({ _id: new Types.ObjectId(clinicId) })
        .exec();
      if (clinicDetails !== null) return clinicDetails;
      else return null;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getClinicByClinicId(clinicId: string): Promise<Clinic> {
    try {
      const clinicDetails = await this.clinicModel
        .findOne({ _id: new Types.ObjectId(clinicId) })
        .populate({
          path: 'doctorId',
          select: 'phone', // fetch only phone
        })
        .exec();
      if (clinicDetails !== null) return clinicDetails;
      else return null;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private isHospitalClinic(clinic: Clinic): boolean {
    return !!(clinic.hospitalId && clinic.hospitalDoctorMappingId);
  }

  async updateClinic(
    clinicId: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<string> {
    if (updateClinicDto.updateBy === '') {
      throw new HttpException(
        'Please provide updateBy field',
        HttpStatus.BAD_REQUEST,
      );
    }
    // validations
    const currentClinic = await this.clinicModel
      .findOne({ _id: new Types.ObjectId(clinicId) })
      .populate({
        path: 'doctorId',
        select: 'phone',
      })
      .exec();

    if (
      updateClinicDto.updateBy === 'DOCTOR' &&
      this.isHospitalClinic(currentClinic)
    ) {
      throw new HttpException(
        'Please connect to you ADMIN to make changes, you are not allowed to make changes.',
        HttpStatus.BAD_REQUEST,
      );
    }

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
      if (
        updateClinicData?.addressPayload &&
        updateClinicData?.updateBy === 'DOCTOR'
      ) {
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
        let shouldDfoUpdate = false;
        if (currentClinic.appointmentFee === 0) {
          shouldDfoUpdate = true;
        }
        currentClinic.appointmentFee =
          updateClinicData?.feeFollowupPayload?.appointmentFee;
        currentClinic.emergencyFee =
          updateClinicData?.feeFollowupPayload?.emergencyFee;

        if (currentClinic.appointmentFee === 0) {
          shouldDfoUpdate = true;
        }

        if (shouldDfoUpdate && updateClinicData?.updateBy === 'DOCTOR') {
          const dfoObject = {
            dfo: {
              isClinicFeeSet: currentClinic.appointmentFee !== 0,
            },
          };
          const docPhone = (currentClinic?.doctorId as any)?.phone;
          this.dfoService.addDfo(docPhone, dfoObject);
        }
      }
      // update slot duration and timings if present
      if (updateClinicData?.timingPayload) {
        let shouldDfoUpdate = false;
        if (currentClinic.clinicTimings?.length === 0) {
          shouldDfoUpdate = true;
        }
        const timings = updateClinicData.timingPayload.eachDayInfo || [];

        // Validate that timings don't overlap internally
        if (timings.length > 0 && !this.validateNoOverlappingTimings(timings)) {
          throw new HttpException(
            'Appointment timings overlap for one or more days',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Update appointment settings
        currentClinic.slotDuration =
          updateClinicData.timingPayload.slotDuration;
        currentClinic.clinicTimings =
          updateClinicData.timingPayload.eachDayInfo;

        if (currentClinic.clinicTimings?.length === 0) {
          shouldDfoUpdate = true;
        }

        if (shouldDfoUpdate && updateClinicData?.updateBy === 'DOCTOR') {
          const dfoObject = {
            dfo: {
              isClinicTimingSet: currentClinic.clinicTimings?.length !== 0,
            },
          };
          const docPhone = (currentClinic?.doctorId as any)?.phone;
          this.dfoService.addDfo(docPhone, dfoObject);
        }
      }
      const updatedClinic = await currentClinic.save();
      // Notification to doctor if updated by hospital

      if (
        updateClinicData?.updateBy === 'ADMIN' &&
        this.isHospitalClinic(updatedClinic)
      ) {
        await updatedClinic.populate([
          {
            path: 'doctorId',
            select: 'phone',
          },
          {
            path: 'hospitalId',
            select: 'hospitalName',
          },
        ]);

        const doctor = updatedClinic.doctorId as any;
        const hospital = updatedClinic.hospitalId as any;
        let body = '';
        let screen = '';
        let params: Record<string, any> = {};
        if (
          updateClinicData?.feeFollowupPayload &&
          updateClinicData?.timingPayload
        ) {
          body = `${hospital.hospitalName} updated the clinic fee and timings.`;
          screen = 'clinicDetailClinics';
          params = {
            source: 'clinicFee',
          };
        } else if (updateClinicData?.feeFollowupPayload) {
          screen = 'clinicDetailClinics';
          params = {
            source: 'clinicFee',
          };
          body = `${hospital.hospitalName} updated the clinic fee.`;
        } else if (updateClinicData?.timingPayload) {
          screen = 'clinicDetailClinics';
          params = {
            source: 'clinicTiming',
          };
          body = `${hospital.hospitalName} updated the clinic timings.`;
        }
        const notificationPayload = {
          user: {
            phone: doctor.phone,
            type: UserType.DOCTOR,
          },
          title: 'Hospital Clinic Update.',
          body: body,
          data: {
            notificationId: '',
            category: NotificationCategory.HOSPITAL_ANNOUNCEMENT,
            icon: '',
            clinicId: updatedClinic?._id,
            actionCategory: NotificationActionCategory.NONE,
            screen: screen,
            params: params,
          },
        };

        this.notificationTokenService.sendNotification(notificationPayload);
      }
      // Notification to doctor if updated by hospital
      return updatedClinic;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Validates that timings for each day do not overlap
   * @param eachDayInfo Array of EachDayInfo objects containing day and timings
   * @returns boolean indicating whether there are no overlapping timings
   */
  private validateNoOverlappingTimings(eachDayInfo: EachDayInfo[]): boolean {
    // For each day, check if any timings overlap
    for (const dayInfo of eachDayInfo) {
      const timings = dayInfo.timings;

      // Sort timings by start time for easier comparison
      const sortedTimings = [...timings].sort((a, b) => {
        return (
          this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
        );
      });

      // Check for overlaps in sorted timings
      for (let i = 0; i < sortedTimings.length - 1; i++) {
        const currentTiming = sortedTimings[i];
        const nextTiming = sortedTimings[i + 1];

        // If end time of current timing is after start time of next timing, they overlap
        if (
          this.timeToMinutes(currentTiming.endTime) >
          this.timeToMinutes(nextTiming.startTime)
        ) {
          return false; // Overlap found
        }
      }
    }

    return true; // No overlaps found
  }

  /**
   * Converts time string in format "HH:MM" to minutes since midnight
   * @param time Time string in format "HH:MM"
   * @returns Number of minutes since midnight
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async deleteClinic(
    doctorId: Types.ObjectId,
    clinicId: string,
  ): Promise<string> {
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
