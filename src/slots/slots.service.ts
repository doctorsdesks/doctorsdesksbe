import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Slot } from 'src/common/models/slot.model';
import { SlotStatus } from 'src/common/enums';
import { ClinicService } from 'src/clinic/clinic.service';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class SlotsService {
  constructor(
    private readonly clinicService: ClinicService,
    private readonly appointmentService: AppointmentService,
  ) {}

  async getClinicSlots(clinicId: string, dateStr: string): Promise<any> {
    try {
      // Parse the date string to get the day of the week
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new HttpException(
          'Invalid date format. Please use YYYY-MM-DD format.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = date.getDay();
      // Convert to our Day enum (MONDAY, TUESDAY, etc.)
      const days = [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ];
      const dayName = days[dayOfWeek];

      // Get the clinic details
      const clinic = await this.clinicService.getClinicByClinicId(clinicId);

      if (!clinic) {
        throw new HttpException(
          `No clinic found with ID ${clinicId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Find the clinic timings for the given day
      const dayInfo = clinic.clinicTimings?.find(
        (info) => info.day === dayName,
      );

      // Check if any timings are available
      if (!dayInfo || !dayInfo.timings || dayInfo.timings.length === 0) {
        return {
          message: `No timings available for ${dayName}`,
          slots: {
            slots: [],
          },
        };
      }

      // Generate slots
      const slots = [];
      if (dayInfo && dayInfo.timings && dayInfo.timings.length > 0) {
        for (const timing of dayInfo.timings) {
          const generatedSlots = await this.generateDetailedSlots(
            timing.startTime,
            timing.endTime,
            clinic.slotDuration,
            clinic.doctorId,
            dateStr,
          );
          slots.push(...generatedSlots);
        }
      }

      return {
        message: `Slots for clinic on ${dateStr} (${dayName})`,
        slots: {
          slots,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error getting clinic slots: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateDetailedSlots(
    startTime: string,
    endTime: string,
    slotDurationMinutes: number,
    doctorId: string,
    dateStr: string,
  ): Promise<Slot[]> {
    const slots = [];
    const dummyDateStr = '2000-01-01'; // Dummy date for time calculations

    // Parse start and end times
    const startDateTime = new Date(`${dummyDateStr}T${startTime}`);
    const endDateTime = new Date(`${dummyDateStr}T${endTime}`);

    // Get all appointments for this doctor on this date
    let appointments = [];
    try {
      appointments = await this.appointmentService.getAppointments(
        dateStr,
        doctorId,
        '',
        true,
      );
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Continue with empty appointments array if there's an error
    }

    // Generate slots
    let currentSlotStart = new Date(startDateTime);
    while (currentSlotStart < endDateTime) {
      // Calculate slot end time
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(
        currentSlotEnd.getMinutes() + slotDurationMinutes,
      );

      // If slot end time exceeds the end time, break
      if (currentSlotEnd > endDateTime) {
        break;
      }

      // Format times as HH:MM
      const formattedStartTime = this.formatTime(currentSlotStart);
      const formattedEndTime = this.formatTime(currentSlotEnd);

      // Default slot status and initialize detailed slot
      let slotStatus = SlotStatus.OPEN;
      const detailedSlot: any = {
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        slotStatus: slotStatus,
      };

      // Check if this slot overlaps with any appointment
      for (const appointment of appointments) {
        if (
          appointment.startTime === formattedStartTime &&
          appointment.endTime === formattedEndTime
        ) {
          // If appointment is cancelled, keep slot as OPEN
          if (appointment.status === 'CANCELLED') {
            slotStatus = SlotStatus.OPEN;
          } else {
            // If appointment exists for this exact time slot and is not cancelled
            slotStatus = appointment.isLockedByDoctor
              ? SlotStatus.LOCKED
              : SlotStatus.BOOKED;
          }

          detailedSlot.slotStatus = slotStatus;

          // Add appointment details if it's booked
          if (slotStatus === SlotStatus.BOOKED) {
            detailedSlot.patientName = appointment.patientName;
            detailedSlot.appointmentType = appointment.appointmentType;
            detailedSlot.opdAppointmentType = appointment.opdAppointmentType;
            detailedSlot.status = appointment.status;
          }

          // Add locked information if it's locked
          if (
            slotStatus === SlotStatus.LOCKED ||
            (appointment.isLockedByDoctor && appointment.status !== 'CANCELLED')
          ) {
            detailedSlot.isLockedByDoctor = appointment.isLockedByDoctor;
            detailedSlot.appointmentId = appointment._id.toString(); // Include appointmentId for locked slots
          }

          break;
        }
      }

      // Add slot to the list
      slots.push(detailedSlot);

      // Move to the next slot
      currentSlotStart = new Date(currentSlotEnd);
    }

    return slots;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
