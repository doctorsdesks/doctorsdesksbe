import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { ClinicModule } from 'src/clinic/clinic.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    ClinicModule,
    UserModule,
  ],
  exports: [DoctorService],
  providers: [DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
