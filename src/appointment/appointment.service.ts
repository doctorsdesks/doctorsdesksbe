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
  PatientType,
} from 'src/common/enums';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { LockAppointmentDto } from './dto/lock-appointment.dto';
import { UnblockSlotDto } from './dto/unblock-slot.dto';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  /**
   * Validates that the appointment date and time are in the future
   * @param date Appointment date in YYYY-MM-DD format
   * @param startTime Appointment start time in HH:MM format
   * @throws HttpException if the appointment date or time is in the past
   */
  private validateAppointmentDateTime(date: string, startTime: string): void {
    // Validate appointment date and time
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for date comparison

    // Check if appointment date is in the past
    if (appointmentDate < today) {
      throw new HttpException(
        'Cannot book appointment for past dates',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If appointment is for today, check if the time is in the past
    if (appointmentDate.getTime() === today.getTime()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [appointmentHour, appointmentMinute] = startTime
        .split(':')
        .map(Number);

      // Check if appointment time is in the past
      if (
        appointmentHour < currentHour ||
        (appointmentHour === currentHour && appointmentMinute <= currentMinute)
      ) {
        throw new HttpException(
          'Cannot book appointment for past time',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Check if the requested appointment slot is available
   * @param doctorId Doctor's phone number
   * @param date Appointment date in YYYY-MM-DD format
   * @param startTime Appointment start time in HH:MM format
   * @param endTime Appointment end time in HH:MM format
   * @param appointmentType Type of appointment (OPD or EMERGENCY)
   * @returns Object with availability status and overlap information
   */
  private async isSlotAvailable(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    appointmentType: AppointmentType,
  ): Promise<{ isAvailable: boolean; hasOverlap: boolean }> {
    // Check for conflicts
    const conflictingAppointments = await this.appointmentModel
      .find({
        doctorId: doctorId,
        date: date,
        $or: [
          // Case 1: New appointment starts during an existing appointment
          {
            startTime: { $lte: startTime },
            endTime: { $gt: startTime },
          },
          // Case 2: New appointment ends during an existing appointment
          {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime },
          },
          // Case 3: New appointment completely contains an existing appointment
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime },
          },
        ],
        status: { $ne: AppointmentStatus.CANCELLED }, // Ignore cancelled appointments
      })
      .exec();

    const hasOverlap = conflictingAppointments.length > 0;

    // If it's an emergency appointment, allow booking regardless of conflicts
    // but indicate if there's an overlap
    if (appointmentType === AppointmentType.EMERGENCY) {
      return { isAvailable: true, hasOverlap };
    }

    // For non-emergency appointments, the slot is only available if there are no conflicts
    return { isAvailable: !hasOverlap, hasOverlap };
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      // Validate appointment date and time
      this.validateAppointmentDateTime(
        createAppointmentDto.date,
        createAppointmentDto.startTime,
      );

      // Check if the requested slot is available
      const appointmentType =
        AppointmentType[createAppointmentDto?.appointmentType];
      const { isAvailable, hasOverlap } = await this.isSlotAvailable(
        createAppointmentDto.doctorId,
        createAppointmentDto.date,
        createAppointmentDto.startTime,
        createAppointmentDto.endTime,
        appointmentType,
      );

      // For non-emergency appointments, throw an error if the slot is not available
      if (!isAvailable) {
        throw new HttpException(
          'The requested appointment slot is already booked. Please choose a different time.',
          HttpStatus.CONFLICT,
        );
      }

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
        isOverlapping: false, // Default to false
      };

      // Set isOverlapping to true for emergency appointments that overlap with existing appointments
      if (appointmentType === AppointmentType.EMERGENCY && hasOverlap) {
        appointmentModelObject.isOverlapping = true;
      }

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
        doctorGraduation: doctorInfo?.graduation,
        doctorSpecialisation: doctorInfo?.specialisation,
        doctorOtherQualification: doctorInfo?.otherQualification,
        appointmentPatientType: patientInfo?.type || PatientType.PRIMARY,
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
    allAppointment?: boolean,
  ): Promise<any[]> {
    try {
      if (!doctorId && !patientId) {
        throw new BadRequestException('Provide either doctorId or patientId.');
      }
      const query: any = {};
      if (doctorId) query.doctorId = doctorId;
      if (patientId) query.patientId = patientId;
      if (date) query.date = date;
      const appointments = await this.appointmentModel.find(query).exec();
      if (!appointments) {
        throw new HttpException(
          'No appointment is found.',
          HttpStatus.NOT_FOUND,
        );
      }
      const realAppointments = allAppointment
        ? appointments
        : appointments?.filter(
            (appointment: Appointment) => !appointment.isLockedByDoctor,
          );
      const sortedAppointments = realAppointments.sort((a, b) => {
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

  /**
   * Lock and unlock multiple appointment slots at once
   * @param lockAppointmentDtos Array of LockAppointmentDto objects for blocking slots
   * @param unblockSlotDtos Array of UnblockSlotDto objects for unblocking slots
   * @returns Success message
   */
  async lockMultipleAppointments(
    lockAppointmentDtos: LockAppointmentDto[] = [],
    unblockSlotDtos: UnblockSlotDto[] = [],
  ): Promise<{ message: string }> {
    try {
      const blockedAppointments: Appointment[] = [];
      const unblockedAppointments: Appointment[] = [];

      // Handle unblocking slots first
      if (unblockSlotDtos && unblockSlotDtos.length > 0) {
        for (const unblockSlotDto of unblockSlotDtos) {
          try {
            const appointment = await this.appointmentModel
              .findById(unblockSlotDto.appointmentId)
              .exec();

            if (!appointment) {
              throw new HttpException(
                `Appointment with ID ${unblockSlotDto.appointmentId} not found`,
                HttpStatus.NOT_FOUND,
              );
            }

            // Update the appointment status to CANCELLED
            appointment.status = AppointmentStatus.CANCELLED;
            appointment.reasonForCancel = 'Unblocked By Doctor';
            appointment.updatedBy = AppointmentByType.DOCTOR;

            const updatedAppointment = await appointment.save();
            unblockedAppointments.push(updatedAppointment);
          } catch (error) {
            if (error instanceof HttpException) {
              throw error;
            }
            throw new HttpException(
              `Error unblocking appointment: ${error.message}`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      // Handle blocking slots
      if (lockAppointmentDtos && lockAppointmentDtos.length > 0) {
        // First validate all appointments
        const invalidAppointments = [];

        // Validate all appointments first
        for (const lockAppointmentDto of lockAppointmentDtos) {
          try {
            this.validateAppointmentDateTime(
              lockAppointmentDto.date,
              lockAppointmentDto.startTime,
            );
          } catch (error) {
            invalidAppointments.push({
              appointment: lockAppointmentDto,
              error: error.message,
            });
          }
        }

        // If any appointments are invalid, throw an error with details
        if (invalidAppointments.length > 0) {
          const errorMessages = invalidAppointments.map(
            (item) =>
              `Appointment ${item.appointment.date} ${item.appointment.startTime}-${item.appointment.endTime}: ${item.error}`,
          );
          throw new HttpException(
            `Cannot lock appointments with invalid dates/times: ${errorMessages.join(', ')}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // All appointments are valid, now create them
        let doctorInfo = null;

        // Check slot availability for all appointments
        const unavailableSlots = [];
        for (const lockAppointmentDto of lockAppointmentDtos) {
          // Locked appointments are always OPD type
          const { isAvailable } = await this.isSlotAvailable(
            lockAppointmentDto.doctorId,
            lockAppointmentDto.date,
            lockAppointmentDto.startTime,
            lockAppointmentDto.endTime,
            AppointmentType.OPD,
          );

          if (!isAvailable) {
            unavailableSlots.push(
              `${lockAppointmentDto.date} ${lockAppointmentDto.startTime}-${lockAppointmentDto.endTime}`,
            );
          }
        }

        // If any slots are unavailable, throw an error
        if (unavailableSlots.length > 0) {
          throw new HttpException(
            `Cannot lock appointments. The following slots are already booked: ${unavailableSlots.join(', ')}`,
            HttpStatus.CONFLICT,
          );
        }

        // Process each appointment in the array
        for (const lockAppointmentDto of lockAppointmentDtos) {
          // Get doctor info (only once if all appointments have the same doctorId)
          if (
            !doctorInfo ||
            doctorInfo.doctorId !== lockAppointmentDto.doctorId
          ) {
            const doctorData = await this.doctorService.findByPhone(
              lockAppointmentDto.doctorId,
            );
            doctorInfo = {
              doctorId: lockAppointmentDto.doctorId,
              name: doctorData?.name,
            };
          }

          // Create appointment object with required fields
          const appointmentModelObject: any = {
            doctorId: lockAppointmentDto.doctorId,
            doctorName: doctorInfo.name,
            // For locking case, patientId and patientName are left empty as per requirement
            date: lockAppointmentDto.date,
            startTime: lockAppointmentDto.startTime,
            endTime: lockAppointmentDto.endTime,
            appointmentType: AppointmentType.OPD, // Default to OPD
            status: AppointmentStatus.ACCEPTED, // Auto-accept since it's created by doctor
            createdBy: AppointmentByType.DOCTOR,
            isLockedByDoctor: lockAppointmentDto.isLockedByDoctor || true, // Default to true if not provided
            appointmentPatientType: PatientType.PRIMARY,
            isOverlapping: false, // Default to false for locked appointments
          };

          // Create and save the appointment
          const appointment = new this.appointmentModel(appointmentModelObject);
          const createdAppointment = await appointment.save();
          blockedAppointments.push(createdAppointment);
        }
      }

      // Count the number of blocked and unblocked slots
      const blockedCount = blockedAppointments.length;
      const unblockedCount = unblockedAppointments.length;

      return {
        message: `Successfully processed appointments: ${blockedCount} slots blocked, ${unblockedCount} slots unblocked.`,
      };
    } catch (error) {
      // If it's already an HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise, wrap it in an HttpException
      throw new HttpException(
        `Error processing appointments: ${error.message}`,
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
            if (reasonForCancel === '') {
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
