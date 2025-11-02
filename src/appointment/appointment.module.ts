import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { PatientModule } from 'src/patient/patient.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { UserModule } from 'src/users/user.module';
import { NotificationTokenModule } from 'src/notificationToken/notification-token.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    PatientModule,
    DoctorModule,
    UserModule,
    NotificationTokenModule,
    NotificationModule,
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
