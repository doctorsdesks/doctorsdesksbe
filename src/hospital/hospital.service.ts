import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from './schemas/hospital.schema';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/user.service';
import { AppointmentStatus, RequestStatus, UserType } from 'src/common/enums';
import { Appointment } from 'src/appointment/schemas/appointment.schema';
import { HospitalDoctor } from 'src/hospital-doctor/schemas/hospital-doctor.schema';

@Injectable()
export class HospitalService {
  constructor(
    private readonly userService: UserService,

    @InjectModel(Hospital.name)
    private hospitalModel: Model<Hospital>,

    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,

    @InjectModel(HospitalDoctor.name)
    private hospitalDoctorModel: Model<HospitalDoctor>,
  ) {}

  async createHospital(
    createHospitalDto: CreateHospitalDto,
  ): Promise<Hospital> {
    try {
      const user = new CreateUserDto(
        createHospitalDto?.phone,
        createHospitalDto?.password,
        UserType.ADMIN,
      );
      const userResponse = await this.userService.createUser(user);

      if (userResponse.status !== 'Success') {
        console.error('Failed to create user account:', userResponse);
        throw new HttpException(
          'Failed to create user account',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newHospital = new this.hospitalModel(createHospitalDto);
      const hospital = await newHospital.save();
      return hospital;
    } catch (error) {
      console.info('eroor while creating hospital', error);
      if (error.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new ConflictException(
          `Account is already exist with ${createHospitalDto.phone}`,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Array<Hospital>> {
    const hospitals = await this.hospitalModel.find().exec();
    return hospitals;
  }

  async findByPhone(phone: string): Promise<Hospital> {
    const hospital = await this.hospitalModel.findOne({ phone }).exec();
    if (!hospital) {
      return null;
    }
    return hospital;
  }

  async getHospitalDetails(phone: string): Promise<any> {
    const hospital = await this.hospitalModel.findOne({ phone }).lean();

    if (!hospital) {
      return null;
    }

    const hospitalId = hospital._id.toString();

    // Adjust format to match how you're storing Appointment.date
    const today = new Date().toISOString().split('T')[0]; // e.g. 2026-06-17

    const [
      totalAppointments,
      completedAppointments,
      pendingAppointmentRequests,
      totalDoctors,
      pendingDoctorRequests,
    ] = await Promise.all([
      this.appointmentModel.countDocuments({
        hospitalId,
        date: today,
      }),

      this.appointmentModel.countDocuments({
        hospitalId,
        date: today,
        status: AppointmentStatus.COMPLETED,
      }),

      this.appointmentModel.countDocuments({
        hospitalId,
        date: today,
        status: AppointmentStatus.PENDING,
      }),

      this.hospitalDoctorModel.countDocuments({
        hospitalId,
        requestStatus: RequestStatus.ACCEPTED,
        isActive: true,
      }),

      this.hospitalDoctorModel.countDocuments({
        hospitalId,
        requestStatus: RequestStatus.PENDING,
      }),
    ]);

    return {
      hospitalId,
      hospitalName: hospital.hospitalName,
      ownerName: hospital.ownerName,
      phone: hospital.phone,
      totalAppointments,
      completedAppointments,
      pendingAppointmentRequests,

      totalDoctors,
      pendingDoctorRequests,
    };
  }

  /**
   * Deletes a hospital by phone number
   * @param phone Phone number of the hospital to delete
   * @returns Object containing success status and message
   */
  async deleteHospital(
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.hospitalModel
        .findOneAndDelete({ phone })
        .exec();

      if (!result) {
        return {
          success: false,
          message: `Hospital not found with phone ${phone}`,
        };
      }

      return {
        success: true,
        message: `Hospital with phone ${phone} has been deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting hospital: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
