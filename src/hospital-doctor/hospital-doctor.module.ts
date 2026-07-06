import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HospitalDoctor,
  HospitalDoctorSchema,
} from './schemas/hospital-doctor.schema';
import { HospitalDoctorController } from './hospital-doctor.controller';
import { HospitalDoctorService } from './hospital-doctor.service';
import { Doctor, DoctorSchema } from 'src/doctor/schemas/doctor.schema';
import { Hospital, HospitalSchema } from 'src/hospital/schemas/hospital.schema';
import { SignupModule } from 'src/signup/signup.module';
import { NotificationTokenModule } from 'src/notificationToken/notification-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HospitalDoctor.name,
        schema: HospitalDoctorSchema,
      },
      {
        name: Doctor.name,
        schema: DoctorSchema,
      },
      {
        name: Hospital.name,
        schema: HospitalSchema,
      },
    ]),
    SignupModule,
    NotificationTokenModule,
  ],
  controllers: [HospitalDoctorController],
  providers: [HospitalDoctorService],
  exports: [HospitalDoctorService],
})
export class HospitalDoctorModule {}
