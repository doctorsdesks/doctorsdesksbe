import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DoctorModule } from './doctor/doctor.module';
import { SignupController } from './signup/signup.controller';
import { SignupService } from './signup/signup.service';
import { SignupModule } from './signup/signup.module';
import { ClinicController } from './clinic/clinic.controller';
import { ClinicModule } from './clinic/clinic.module';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { DfoModule } from './dfo/dfo.module';
import { PatientModule } from './patient/patient.module';
import { TranslationController } from './translation/translation.controller';
import { TranslationModule } from './translation/translation.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DfoController } from './dfo/dfo.controller';
import { PatientController } from './patient/patient.controller';
import { AppointmentController } from './appointment/appointment.controller';
import { UserModule } from './users/user.module';
import { SlotsModule } from './slots/slots.module';
import { SlotsController } from './slots/slots.controller';
import { ConfigModule } from './config/config.module';
import { ConfigController } from './config/config.controller';

@Module({
  imports: [
    DatabaseModule,
    NestConfigModule.forRoot({
      isGlobal: true, // Make it global so you can access it in any module
    }),
    DoctorModule,
    SignupModule,
    ClinicModule,
    HealthModule,
    DfoModule,
    PatientModule,
    UserModule,
    AppointmentModule,
    TranslationModule,
    SlotsModule,
    ConfigModule,
  ],
  controllers: [
    AppController,
    SignupController,
    ClinicController,
    HealthController,
    DfoController,
    PatientController,
    AppointmentController,
    TranslationController,
    SlotsController,
    ConfigController,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    SignupService,
    HealthService,
  ],
})
export class AppModule {}
