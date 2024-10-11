import { Body, Controller, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('/v1/clinic')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class ClinicController {
    constructor(
        private readonly clinicService: ClinicService
    ) {}

    @Post("/updateClinic/{clinicId}")
    updateClinicData(@Body() updateClinicDto: UpdateClinicDto, @Param('clinicId') clinicId: string ){
        console.log("Update Clinic with data: ", updateClinicDto);
        return this.clinicService.updateClinic(clinicId, updateClinicDto);
    }
}
