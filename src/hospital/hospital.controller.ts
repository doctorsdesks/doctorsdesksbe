import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Controller('/v1/hospital')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post('/create')
  hospitalSignup(@Body() signupHospitalDto: CreateHospitalDto) {
    return this.hospitalService.createHospital(signupHospitalDto);
  }

  @Get()
  findByPhone(@Query('phone') phone: string) {
    return this.hospitalService.findByPhone(phone.toString());
  }

  @Get('/details')
  getHospitalDetails(@Query('phone') phone: string) {
    return this.hospitalService.getHospitalDetails(phone.toString());
  }

  @Get('/all')
  findAllHospitals() {
    return this.hospitalService.findAll();
  }
}
