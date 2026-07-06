import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './schemas/hospital.schema';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { UserModule } from 'src/users/user.module';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/schemas/appointment.schema';
import {
  HospitalDoctor,
  HospitalDoctorSchema,
} from 'src/hospital-doctor/schemas/hospital-doctor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: HospitalDoctor.name, schema: HospitalDoctorSchema },
    ]),
    UserModule,
  ],
  exports: [HospitalService],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
