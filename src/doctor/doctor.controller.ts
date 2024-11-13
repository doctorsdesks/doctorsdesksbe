import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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

  @Get('/:id')
  findByPhone(@Param('id') id: string) {
    return this.doctorService.findByPhone(id.toString());
  }
}
