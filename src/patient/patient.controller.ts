import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('/v1/patient')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Post('/one')
  updatePatient(
    @Body() updatePatientDto: UpdatePatientDto,
    @Query('phone') phone: string,
  ) {
    return this.patientService.updatePatient(phone, updatePatientDto);
  }

  @Get('/search/:text')
  getPatientsBySeachText(@Param('text') searchString: string) {
    return this.patientService.getPatientsBySeachText(searchString);
  }

  @Get()
  getPatientByPhone(@Query('phone') phone: string) {
    return this.patientService.getPatientByPhone(phone);
  }
}
