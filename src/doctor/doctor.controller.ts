import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { DoctorService } from './doctor.service';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('/v1/doctor')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('/:doctorId')
  updateDoctor(
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorService.update(doctorId, updateDoctorDto);
  }

  @Get()
  findByPhone(@Query('phone') phone: string) {
    return this.doctorService.findByPhone(phone.toString());
  }

  @Get('/all')
  findAllDoctors() {
    return this.doctorService.findAll();
  }

  @Get('/location')
  findAllDoctorsByCity(
    @Query('city') city: string,
    @Query('pincode') pincode: string,
  ) {
    return this.doctorService.findByCity(city, pincode);
  }

  @Get('/specialisationlocation')
  findDoctorsByFilters(
    @Query('specialisation') specialisation: string,
    @Query('city') city?: string,
    @Query('pincode') pincode?: string,
  ) {
    return this.doctorService.findBySpecialisationAndLocation(
      specialisation,
      city,
      pincode,
    );
  }
}
