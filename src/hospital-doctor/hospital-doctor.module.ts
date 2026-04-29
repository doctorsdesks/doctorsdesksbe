import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HospitalDoctor,
  HospitalDoctorSchema,
} from './schemas/hospital-doctor.schema';
import { HospitalDoctorController } from './hospital-doctor.controller';
import { HospitalDoctorService } from './hospital-doctor.service';
import { Doctor, DoctorSchema } from 'src/doctor/schemas/doctor.schema';

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
    ]),
  ],
  controllers: [HospitalDoctorController],
  providers: [HospitalDoctorService],
  exports: [HospitalDoctorService],
})
export class HospitalDoctorModule {}
