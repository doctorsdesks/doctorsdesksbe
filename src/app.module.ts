import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestHeaderInterceptor } from './common/interceptors/request-header.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DoctorsModule } from './doctors/doctors.module';

@Module({
  imports: [
    DatabaseModule, 
    ConfigModule.forRoot({
      isGlobal: true, // Make it global so you can access it in any module
    }),  
    DoctorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestHeaderInterceptor
    }
  ],
})
export class AppModule {}
