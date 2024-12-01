import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('/v1/patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Post('/:phone')
  updatePatient(
    @Body() updatePatientDto: UpdatePatientDto,
    @Param('phone') phone: string,
  ) {
    return this.patientService.updatePatient(phone, updatePatientDto);
  }

  @Get('/:phone')
  getPatientByPhone(@Param('phone') phone: string) {
    return this.patientService.getPatientByPhone(phone);
  }
}
