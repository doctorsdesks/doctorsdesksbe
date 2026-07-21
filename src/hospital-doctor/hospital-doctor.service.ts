import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HospitalDoctor } from './schemas/hospital-doctor.schema';
import { AssignDoctorDto } from './dto/assign-doctor.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  DoctorRolesType,
  NotificationActionCategory,
  NotificationCategory,
  RequestStatus,
  UserType,
} from 'src/common/enums';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { RaiseDoctorRequestDto } from './dto/raise-doctor-request.dto';
import { NotificationTokenService } from 'src/notificationToken/notification-token.service';
import { Hospital } from 'src/hospital/schemas/hospital.schema';
import { SignupService } from 'src/signup/signup.service';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class HospitalDoctorService {
  constructor(
    @InjectModel(HospitalDoctor.name)
    private hospitalDoctorModel: Model<HospitalDoctor>,
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,
    @InjectModel(Hospital.name)
    private hospitalModel: Model<Hospital>,
    private readonly notificationTokenService: NotificationTokenService,
    private readonly signupService: SignupService,
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

  async updateDoctorStatus(dto: UpdateStatusDto) {
    const { mappingId, status } = dto;
    const updated = await this.hospitalDoctorModel.findByIdAndUpdate(
      mappingId,
      { isActive: status },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Mapping not found');
    }

    return {
      message: 'Doctor status has been updated successfully',
      data: updated,
    };
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

  async raiseDoctorRequest(dto: RaiseDoctorRequestDto) {
    const { hospitalId, doctorCode, role } = dto;

    const doctor = await this.doctorModel.findOne({ doctorCode });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const hospital = await this.hospitalModel.findById(hospitalId);

    let request: any = null;

    const existing = await this.hospitalDoctorModel.findOne({
      hospitalId,
      doctorId: doctor._id,
    });

    if (existing) {
      if (existing?.requestStatus !== RequestStatus.REJECTED) {
        throw new BadRequestException(
          existing.requestStatus === RequestStatus.PENDING
            ? 'Request already exists for this doctor'
            : 'Doctor already work with the hospital',
        );
      } else {
        existing.requestStatus = RequestStatus.PENDING;
        request = await existing.save();
      }
    } else {
      request = await this.hospitalDoctorModel.create({
        hospitalId,
        doctorId: doctor._id,
        requestStatus: RequestStatus.PENDING,
        role,
      });
    }

    const notificationPayload = {
      user: {
        phone: doctor.phone,
        type: UserType.DOCTOR,
      },
      title: 'Hospital joining request.',
      body: `${hospital.hospitalName} request you to join the hospital as a ${DoctorRolesType[role]}.`,
      data: {
        notificationId: '',
        category: NotificationCategory.DOCTOR_JOINING_REQUEST,
        icon: 'request',
        mappingId: request?._id,
        actionCategory:
          NotificationActionCategory.DOCTOR_JOINING_REQUEST_ACTIONS,
      },
    };

    this.notificationTokenService.sendNotification(notificationPayload);

    // trigger notification here

    return {
      message: 'Request sent successfully',
      data: request,
    };
  }

  async acceptRequest(mappingId: string) {
    const request = await this.hospitalDoctorModel
      .findById(mappingId)
      .populate({
        path: 'hospitalId',
        select: 'phone hospitalName address',
      })
      .populate({
        path: 'doctorId',
        select: 'phone name',
      });

    const hospitalPhone = (request?.hospitalId as any)?.phone;
    const hospitalName = (request?.hospitalId as any)?.hospitalName;
    const hospitalAddress = (request?.hospitalId as any)?.address;
    const doctorName = (request.doctorId as any).name;
    const docId = (request.doctorId as any)._id;

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.requestStatus === RequestStatus.REJECTED) {
      throw new NotFoundException(
        'Sorry! You have already rejecte this request.',
      );
    }

    request.requestStatus = RequestStatus.ACCEPTED;
    request.isActive = true;

    await request.save();

    const hospitalAddressForClinic = new ClinicAddress(
      hospitalName,
      hospitalAddress,
    );

    const requestId = new Types.ObjectId(mappingId);

    await this.signupService.createClinic(
      hospitalAddressForClinic,
      docId,
      requestId,
      (request?.hospitalId as any)._id,
    );

    const notificationPayload = {
      user: {
        phone: hospitalPhone,
        type: UserType.ADMIN,
      },
      title: 'Doctor accepted request.',
      body: `Congratulations! ${doctorName} accepted your request for joining the hospital.`,
      data: {
        notificationId: '',
        category: NotificationCategory.DOCTOR_JOINING_STATUS,
        icon: 'success',
        mappingId: request._id,
      },
    };

    this.notificationTokenService.sendNotification(notificationPayload);

    return {
      message: 'Doctor request accepted',
    };
  }

  async rejectRequest(mappingId: string) {
    const request = await this.hospitalDoctorModel
      .findById(mappingId)
      .populate({
        path: 'hospitalId',
        select: 'phone hospitalName',
      })
      .populate({
        path: 'doctorId',
        select: 'name',
      });

    const hospitalPhone = (request?.hospitalId as any)?.phone;
    const doctorName = (request.doctorId as any).name;

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    request.requestStatus = RequestStatus.REJECTED;
    request.isActive = false;

    await request.save();

    const notificationPayload = {
      user: {
        phone: hospitalPhone,
        type: UserType.ADMIN,
      },
      title: 'Doctor rejected request.',
      body: `${doctorName} rejected your request for joining the hospital.`,
      data: {
        notificationId: '',
        category: NotificationCategory.DOCTOR_JOINING_STATUS,
        icon: 'reject',
        mappingId: request._id,
      },
    };

    this.notificationTokenService.sendNotification(notificationPayload);

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

  async getOneDoctor(id: string) {
    const mapping = await this.hospitalDoctorModel.findById(id);

    if (!mapping) {
      throw new NotFoundException('Mapping not found');
    }
    return mapping;
  }

  async getDoctorPendingRequests(doctorId: string) {
    return this.hospitalDoctorModel
      .find({
        doctorId,
        requestStatus: RequestStatus.PENDING,
      })
      .populate('hospitalId');
  }

  async getPendingRaisedRequests(hospitalId: string) {
    return this.hospitalDoctorModel
      .find({
        hospitalId,
        requestStatus: RequestStatus.PENDING,
      })
      .populate('doctorId');
  }
}
