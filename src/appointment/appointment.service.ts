import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  AppointmentByType,
  AppointmentStatus,
  AppointmentType,
  AppointmentUpdateType,
  OPDAppointmentType,
} from 'src/common/enums';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { LockAppointmentDto } from './dto/lock-appointment.dto';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      let appointmentModelObject: any = {
        doctorId: createAppointmentDto?.doctorId,
        patientId: createAppointmentDto?.patientId,
        date: createAppointmentDto?.date,
        startTime: createAppointmentDto?.startTime,
        endTime: createAppointmentDto?.endTime,
        appointmentType: AppointmentType[createAppointmentDto?.appointmentType],
        status:
          AppointmentByType[createAppointmentDto.originEntity] ===
          AppointmentByType.DOCTOR
            ? AppointmentStatus.ACCEPTED
            : AppointmentStatus.PENDING,
        createdBy: AppointmentByType[createAppointmentDto.originEntity],
        isLockedByDoctor: false,
      };
      if (
        AppointmentType[createAppointmentDto?.appointmentType] ===
        AppointmentType.OPD
      ) {
        if (OPDAppointmentType[createAppointmentDto?.opdAppointmentType]) {
          appointmentModelObject = {
            ...appointmentModelObject,
            opdAppointmentType:
              OPDAppointmentType[createAppointmentDto?.opdAppointmentType],
          };
        } else {
          throw new HttpException(
            'Please provide valid OPD Appointment.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const patientInfo = await this.patientService.getPatientByPhone(
        createAppointmentDto?.patientId,
      );
      const doctorInfo = await this.doctorService.findByPhone(
        createAppointmentDto?.doctorId,
      );
      appointmentModelObject = {
        ...appointmentModelObject,
        patientImageUrl: patientInfo?.imageUrl,
        patientName: patientInfo?.name,
        doctorImageUrl: doctorInfo?.imageUrl,
        doctorName: doctorInfo?.name,
      };
      const appointment = new this.appointmentModel(appointmentModelObject);
      const createdApppointment = await appointment.save();
      return createdApppointment;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getAppointment(id: string): Promise<Appointment> {
    try {
      const appointment = await this.appointmentModel.findById(id).exec();
      if (!appointment) {
        throw new HttpException('No appointment found', HttpStatus.NOT_FOUND);
      }
      return appointment;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getAppointments(
    date: string,
    doctorId?: string,
    patientId?: string,
  ): Promise<any[]> {
    try {
      if ((!doctorId && !patientId) || !date) {
        throw new BadRequestException(
          'Provide either doctorId or patientId, along with a date.',
        );
      }
      const query: any = {};
      if (doctorId) query.doctorId = doctorId;
      if (patientId) query.patientId = patientId;
      query.date = date;
      const appointments = await this.appointmentModel.find(query).exec();
      if (!appointments) {
        throw new HttpException(
          'No appointment is found.',
          HttpStatus.NOT_FOUND,
        );
      }
      const sortedAppointments = appointments.sort((a, b) => {
        const timeToMinutes = (time) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };

        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      });
      return sortedAppointments;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async lockAppointment(
    lockAppointmentDto: LockAppointmentDto,
  ): Promise<Appointment> {
    try {
      // Create appointment object with required fields
      const appointmentModelObject: any = {
        doctorId: lockAppointmentDto.doctorId,
        patientId: lockAppointmentDto.doctorId, // Using doctorId as patientId as per requirement
        date: lockAppointmentDto.date,
        startTime: lockAppointmentDto.startTime,
        endTime: lockAppointmentDto.endTime,
        appointmentType: AppointmentType.OPD, // Default to OPD
        status: AppointmentStatus.ACCEPTED, // Auto-accept since it's created by doctor
        createdBy: AppointmentByType.DOCTOR,
        isLockedByDoctor: lockAppointmentDto.isLockedByDoctor || true, // Default to true if not provided
      };

      // Get doctor info
      const doctorInfo = await this.doctorService.findByPhone(
        lockAppointmentDto.doctorId,
      );

      // Add doctor info to appointment
      appointmentModelObject.doctorName = doctorInfo?.name;
      appointmentModelObject.patientName = doctorInfo?.name; // Same as doctor since patientId is doctorId

      // Create and save the appointment
      const appointment = new this.appointmentModel(appointmentModelObject);
      const createdAppointment = await appointment.save();
      return createdAppointment;
    } catch (error) {
      throw new HttpException(
        `Error creating locked appointment: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<string> {
    try {
      const currentAppointment = await this.appointmentModel
        .findOne({ _id: new Types.ObjectId(id) })
        .exec();
      if (!currentAppointment) {
        throw new HttpException('No appointment found', HttpStatus.NOT_FOUND);
      }
      const appointmentUpdateType =
        AppointmentUpdateType[updateAppointmentDto.appointmentUpdateType];
      if (!appointmentUpdateType) {
        throw new HttpException(
          `${updateAppointmentDto.appointmentUpdateType} doesn't exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const appointmentUpdateBy =
        AppointmentByType[updateAppointmentDto.updatedBy];
      if (!appointmentUpdateBy) {
        throw new HttpException(
          `${updateAppointmentDto.appointmentUpdateType} doesn't exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      switch (appointmentUpdateType) {
        case AppointmentUpdateType.ACCEPT:
          currentAppointment.status = AppointmentStatus.ACCEPTED;
          break;
        case AppointmentUpdateType.COMPLETE:
          currentAppointment.status = AppointmentStatus.COMPLETED;
          break;
        case AppointmentUpdateType.CANCEL:
          {
            currentAppointment.status = AppointmentStatus.CANCELLED;
            const reasonForCancel: string =
              updateAppointmentDto?.reasonForCancel || '';
            if (reasonForCancel !== '') {
              throw new HttpException(
                `Please provide a valid reason for cancelling.`,
                HttpStatus.BAD_REQUEST,
              );
            }
            currentAppointment.reasonForCancel = reasonForCancel;
          }
          break;
        default:
          break;
      }
      currentAppointment.updatedBy = appointmentUpdateBy;
      await currentAppointment.save();
      return 'Appointment has been updated succesffully!';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
