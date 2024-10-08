import { Body, Controller, Param, Post } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Controller('/v1/clinic')
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
