import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('/v1/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Post('/:id')
  updateAppointment(
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Param('id') id: string,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Get('/:id')
  getAppointment(@Param('id') id: string) {
    return this.appointmentService.getAppointment(id);
  }

  @Get('')
  getDoctorAppointments(
    @Query('date') date: string,
    @Query('doctor') doctorId?: string,
    @Query('patient') patientId?: string,
  ) {
    if (!date || (!doctorId && !patientId)) {
      throw new BadRequestException(
        'Provide either doctorId or patientId and date',
      );
    }
    return this.appointmentService.getAppointments(date, doctorId, patientId);
  }
}
