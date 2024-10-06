import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseFilters,
    HttpException,
    InternalServerErrorException,
  } from '@nestjs/common';  
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
  
  @Controller('/v1/doctors')
  @UseFilters(HttpExceptionFilter)
  export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}
  
    @Post()
    create(@Body() createDoctorDto: CreateDoctorDto) {
      console.info("CreateDoctor called with data:", createDoctorDto);
      return this.doctorsService.create(createDoctorDto);
    }
  
    @Get()
    findAll() {
      console.info('findAll called from web');
      try {
        const data = this.doctorsService.findAll();
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
      return this.doctorsService.findOne(id.toString());
    }
  
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    //   return this.doctorsService.update(id.toString(), updateDoctorDto);
    // }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.doctorsService.delete(id.toString());
    }
  }
  