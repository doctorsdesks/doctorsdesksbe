import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HospitalDoctor } from './schemas/hospital-doctor.schema';
import { AssignDoctorDto } from './dto/assign-doctor.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { UpdateTimingDto } from './dto/update-timing.dto';
import { RequestStatus } from 'src/common/enums';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { RaiseDoctorRequestDto } from './dto/raise-doctor-request.dto';

@Injectable()
export class HospitalDoctorService {
  constructor(
    @InjectModel(HospitalDoctor.name)
    private hospitalDoctorModel: Model<HospitalDoctor>,
    private doctorModel: Model<Doctor>,
  ) {}

  async assignDoctor(assignDoctorDto: AssignDoctorDto) {
    const { hospitalId, doctorId } = assignDoctorDto;

    const existing = await this.hospitalDoctorModel.findOne({
      hospitalId,
      doctorId,
    });

    if (existing) {
      throw new BadRequestException('Doctor already assigned to this hospital');
    }

    const mapping = await this.hospitalDoctorModel.create(assignDoctorDto);

    return {
      message: 'Doctor assigned successfully',
      data: mapping,
    };
  }

  async removeDoctor(mappingId: string) {
    const mapping = await this.hospitalDoctorModel.findById(mappingId);

    if (!mapping) {
      throw new NotFoundException('Mapping not found');
    }

    await this.hospitalDoctorModel.findByIdAndDelete(mappingId);

    return {
      message: 'Doctor removed from hospital successfully',
    };
  }

  async getDoctorsByHospital(hospitalId: string) {
    const doctors = await this.hospitalDoctorModel
      .find({ hospitalId })
      .populate('doctorId');

    return doctors;
  }

  async getHospitalsByDoctor(doctorId: string) {
    const hospitals = await this.hospitalDoctorModel
      .find({ doctorId })
      .populate('hospitalId');

    return hospitals;
  }

  async updateDoctorRole(updateRoleDto: UpdateRoleDto) {
    const { mappingId, role } = updateRoleDto;

    const updated = await this.hospitalDoctorModel.findByIdAndUpdate(
      mappingId,
      { role },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Mapping not found');
    }

    return {
      message: 'Doctor role updated successfully',
      data: updated,
    };
  }

  async updateFees(updateFeeDto: UpdateFeeDto) {
    const { mappingId, appointmentFee, emergencyFee } = updateFeeDto;

    const updated = await this.hospitalDoctorModel.findByIdAndUpdate(
      mappingId,
      {
        appointmentFee,
        emergencyFee,
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Hospital doctor mapping not found');
    }

    return {
      message: 'Fees updated successfully',
      data: updated,
    };
  }

  async updateSlotDuration(updateSlotDto: UpdateSlotDto) {
    const { mappingId, slotDuration } = updateSlotDto;

    const updated = await this.hospitalDoctorModel.findByIdAndUpdate(
      mappingId,
      {
        slotDuration,
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Hospital doctor mapping not found');
    }

    return {
      message: 'Slot duration updated successfully',
      data: updated,
    };
  }

  async updateDoctorTimings(updateTimingDto: UpdateTimingDto) {
    const { mappingId, doctorTimings } = updateTimingDto;

    const updated = await this.hospitalDoctorModel.findByIdAndUpdate(
      mappingId,
      {
        doctorTimings,
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Hospital doctor mapping not found');
    }

    return {
      message: 'Doctor timings updated successfully',
      data: updated,
    };
  }

  async raiseDoctorRequest(dto: RaiseDoctorRequestDto) {
    const { hospitalId, doctorCode } = dto;

    const doctor = await this.doctorModel.findOne({ doctorCode });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const existing = await this.hospitalDoctorModel.findOne({
      hospitalId,
      doctorId: doctor._id,
    });

    if (existing) {
      throw new BadRequestException('Request already exists for this doctor');
    }

    const request = await this.hospitalDoctorModel.create({
      hospitalId,
      doctorId: doctor._id,
      requestStatus: RequestStatus.PENDING,
    });

    // trigger notification here

    return {
      message: 'Request sent successfully',
      data: request,
    };
  }

  async acceptRequest(mappingId: string) {
    const request = await this.hospitalDoctorModel.findById(mappingId);

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    request.requestStatus = RequestStatus.ACCEPTED;

    await request.save();

    return {
      message: 'Doctor request accepted',
    };
  }

  async rejectRequest(mappingId: string) {
    const request = await this.hospitalDoctorModel.findById(mappingId);

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    request.requestStatus = RequestStatus.REJECTED;

    await request.save();

    return {
      message: 'Doctor request rejected',
    };
  }

  async getHospitalDoctors(hospitalId: string) {
    return this.hospitalDoctorModel
      .find({
        hospitalId,
        requestStatus: RequestStatus.ACCEPTED,
      })
      .populate('doctorId');
  }

  async getDoctorPendingRequests(doctorId: string) {
    return this.hospitalDoctorModel
      .find({
        doctorId,
        requestStatus: RequestStatus.PENDING,
      })
      .populate('hospitalId');
  }
}
