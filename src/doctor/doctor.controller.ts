import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseFilters,
    HttpException,
    InternalServerErrorException,
    UseInterceptors,
  } from '@nestjs/common';  
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorService } from './doctor.service';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
  
  @Controller('/v1/doctor')
  @UseInterceptors(RequestHeaderInterceptor)
  @UseFilters(HttpExceptionFilter)
  export class DoctorController {
    constructor(private readonly doctorService: DoctorService) {}
  
    @Post()
    createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
      console.info("CreateDoctor called with data:", createDoctorDto);
      return this.doctorService.createDoctor(createDoctorDto);
    }
  
    @Get()
    findAll() {
      console.info('findAll called from web');
      try {
        const data = this.doctorService.findAll();
        return data;
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        } else  {
          throw new InternalServerErrorException('An unexpected error occured');
        }
      }
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.doctorService.findOne(id.toString());
    }
  
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    //   return this.doctorsService.update(id.toString(), updateDoctorDto);
    // }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.doctorService.delete(id.toString());
    }
  }
  