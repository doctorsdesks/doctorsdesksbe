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

      // Get the clinic details using direct model query
      // We need to use InjectModel for this specific case
      const clinic = await this.clinicService.getClinicByClinicId(clinicId);

      if (!clinic) {
        throw new HttpException(
          `No clinic found with ID ${clinicId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Find the clinic timings for the given day
      const dayInfo = clinic.clinicTimings.find((info) => info.day === dayName);

      if (!dayInfo || !dayInfo.timings || dayInfo.timings.length === 0) {
        return {
          message: `No timings available for ${dayName}`,
          slots: [],
        };
      }

      // Generate slots for each timing based on slotDuration
      const allSlots = [];
      const slotDurationMinutes = clinic.slotDuration;

      for (const timing of dayInfo.timings) {
        const slots = await this.generateSlots(
          timing.startTime,
          timing.endTime,
          slotDurationMinutes,
          clinic.doctorId,
          dateStr,
        );
        allSlots.push(...slots);
      }

      return {
        message: `Slots for clinic on ${dateStr} (${dayName})`,
        slots: allSlots,
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

  private async generateSlots(
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

      // Default slot status
      let slotStatus = SlotStatus.OPEN;

      // Check if this slot overlaps with any appointment
      for (const appointment of appointments) {
        if (
          appointment.startTime === formattedStartTime &&
          appointment.endTime === formattedEndTime
        ) {
          // If appointment exists for this exact time slot
          slotStatus = appointment.isLockedByDoctor
            ? SlotStatus.LOCKED
            : SlotStatus.BOOKED;
          break;
        }
      }

      const currentSlot = new Slot(
        formattedStartTime,
        formattedEndTime,
        slotStatus,
      );

      // Add slot to the list
      slots.push(currentSlot);

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
