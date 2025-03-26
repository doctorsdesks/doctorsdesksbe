import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    UserModule,
  ],
  exports: [PatientService],
})
export class PatientModule {}
