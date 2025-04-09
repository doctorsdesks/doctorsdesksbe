import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { LockMultipleAppointmentsDto } from './dto/lock-multiple-appointments.dto';

@Controller('/v1/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Post('/lock')
  lockMultipleAppointments(
    @Body() lockMultipleAppointmentsDto: LockMultipleAppointmentsDto,
  ) {
    return this.appointmentService.lockMultipleAppointments(
      lockMultipleAppointmentsDto.appointments,
    );
  }

  @Post('/update')
  updateAppointment(
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Query('id') id: string,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Get('/one')
  getAppointment(@Query('id') id: string) {
    return this.appointmentService.getAppointment(id);
  }

  @Get('')
  getAppointments(
    @Query('date') date?: string,
    @Query('doctor') doctorId?: string,
    @Query('patient') patientId?: string,
  ) {
    if (!doctorId && !patientId) {
      throw new BadRequestException('Provide either doctorId or patientId');
    }
    return this.appointmentService.getAppointments(date, doctorId, patientId);
  }
}
