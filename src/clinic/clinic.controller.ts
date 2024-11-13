import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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

  @Get('/:doctorId')
  getAllClinics(@Param('doctorId') doctorId: string) {
    return this.clinicService.getAllClinics(doctorId);
  }

  @Get('/:doctorId/:clinicId')
  getClinic(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.getClinic(doctorId, clinicId);
  }

  @Post('/update/:doctorId/:clinicId')
  updateClinic(
    @Body() updateClinicDto: UpdateClinicDto,
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
  ) {
    console.log(
      'Update Clinic with data: ',
      doctorId,
      clinicId,
      updateClinicDto,
    );
    return this.clinicService.updateClinic(doctorId, clinicId, updateClinicDto);
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
