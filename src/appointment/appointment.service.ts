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

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
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
  ): Promise<Appointment[]> {
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
      return appointments;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
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
          currentAppointment.status = AppointmentStatus.CANCELLED;
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
