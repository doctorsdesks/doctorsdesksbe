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

@Module({
  imports: [
    DatabaseModule, 
    ConfigModule.forRoot({
      isGlobal: true, // Make it global so you can access it in any module
    }),  
    DoctorModule, 
    SignupModule, 
    ClinicModule,
  ],
  controllers: [AppController, SignupController, ClinicController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestHeaderInterceptor
    },
    SignupService,
  ],
})
export class AppModule {}
