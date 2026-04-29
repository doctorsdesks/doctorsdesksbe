import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { HospitalDoctorService } from './hospital-doctor.service';
import { RaiseDoctorRequestDto } from './dto/raise-doctor-request.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { UpdateTimingDto } from './dto/update-timing.dto';

@Controller('/v1/hospital-doctor')
export class HospitalDoctorController {
  constructor(private readonly hospitalDoctorService: HospitalDoctorService) {}

  /**
   * Hospital sends request to doctor
   * Admin enters doctor code and sends request
   */
  @Post('request')
  raiseDoctorRequest(@Body() dto: RaiseDoctorRequestDto) {
    return this.hospitalDoctorService.raiseDoctorRequest(dto);
  }

  /**
   * Doctor accepts hospital request
   */
  @Patch('accept/:mappingId')
  acceptRequest(@Param('mappingId') mappingId: string) {
    return this.hospitalDoctorService.acceptRequest(mappingId);
  }

  /**
   * Doctor rejects hospital request
   */
  @Patch('reject/:mappingId')
  rejectRequest(@Param('mappingId') mappingId: string) {
    return this.hospitalDoctorService.rejectRequest(mappingId);
  }

  /**
   * Get all accepted doctors of a hospital
   */
  @Get('hospital/:hospitalId')
  getDoctorsByHospital(@Param('hospitalId') hospitalId: string) {
    return this.hospitalDoctorService.getDoctorsByHospital(hospitalId);
  }

  /**
   * Get all hospitals associated with doctor
   */
  @Get('doctor/:doctorId')
  getHospitalsByDoctor(@Param('doctorId') doctorId: string) {
    return this.hospitalDoctorService.getHospitalsByDoctor(doctorId);
  }

  /**
   * Get pending hospital requests for doctor app
   */
  @Get('doctor/pending/:doctorId')
  getDoctorPendingRequests(@Param('doctorId') doctorId: string) {
    return this.hospitalDoctorService.getDoctorPendingRequests(doctorId);
  }

  /**
   * Remove doctor from hospital
   */
  @Delete(':mappingId')
  removeDoctor(@Param('mappingId') mappingId: string) {
    return this.hospitalDoctorService.removeDoctor(mappingId);
  }

  /**
   * Update doctor role
   */
  @Patch('update-role')
  updateDoctorRole(@Body() dto: UpdateRoleDto) {
    return this.hospitalDoctorService.updateDoctorRole(dto);
  }

  /**
   * Update appointment/emergency fees
   * Only allowed after doctor accepts request
   */
  @Patch('update-fees')
  updateFees(@Body() dto: UpdateFeeDto) {
    return this.hospitalDoctorService.updateFees(dto);
  }

  /**
   * Update slot duration
   */
  @Patch('update-slot-duration')
  updateSlotDuration(@Body() dto: UpdateSlotDto) {
    return this.hospitalDoctorService.updateSlotDuration(dto);
  }

  /**
   * Update doctor timings
   */
  @Patch('update-timings')
  updateTimings(@Body() dto: UpdateTimingDto) {
    return this.hospitalDoctorService.updateDoctorTimings(dto);
  }
}
