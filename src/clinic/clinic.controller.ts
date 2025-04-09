import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { CreateClinicDto } from './dto/create-clinic.dto';

@Controller('/v1/clinic')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get('/all')
  getAllClinics(@Query('doctor') doctorId: string) {
    return this.clinicService.getAllClinics(doctorId);
  }

  @Get('/one')
  getClinic(@Query('clinic') clinicId: string) {
    return this.clinicService.getClinic(clinicId);
  }

  @Post('/one/:clinicId')
  updateClinic(
    @Body() updateClinicDto: UpdateClinicDto,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.updateClinic(clinicId, updateClinicDto);
  }

  @Post('/add/:doctorId')
  addClinicToDoctor(
    @Body() createClinicDto: Partial<CreateClinicDto>,
    @Param('doctorId') doctorId: string,
  ) {
    return this.clinicService.addClinicToDoctor(doctorId, createClinicDto);
  }

  @Delete('/:doctorId/:clinicId')
  deleteClinic(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.deleteClinic(doctorId, clinicId);
  }
}
