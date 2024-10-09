import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { DoctorModule } from 'src/doctor/doctor.module';
import { ClinicModule } from 'src/clinic/clinic.module';

@Module({
    imports: [DoctorModule, ClinicModule],
    providers: [SignupService],
    controllers: [SignupController]
})
export class SignupModule {}
