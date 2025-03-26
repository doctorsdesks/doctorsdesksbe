import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { DoctorModule } from 'src/doctor/doctor.module';
import { ClinicModule } from 'src/clinic/clinic.module';
import { DfoModule } from 'src/dfo/dfo.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [DoctorModule, ClinicModule, DfoModule, UserModule],
  providers: [SignupService],
  controllers: [SignupController],
})
export class SignupModule {}
