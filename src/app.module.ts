import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestHeaderInterceptor } from './common/interceptors/request-header.interceptor';
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

@Module({
  imports: [
    DatabaseModule, 
    ConfigModule.forRoot({
      isGlobal: true, // Make it global so you can access it in any module
    }),  
    DoctorModule, 
    SignupModule, 
    ClinicModule,
    HealthModule,
  ],
  controllers: [AppController, SignupController, ClinicController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    SignupService,
    HealthService
  ],
})
export class AppModule {}
