import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
    imports: [DoctorModule],
    providers: [SignupService],
    controllers: [SignupController]
})
export class SignupModule {}
