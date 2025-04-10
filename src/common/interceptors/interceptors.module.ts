import { Module } from '@nestjs/common';
import { RequestHeaderInterceptor } from './request-header.interceptor';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [UserModule],
  providers: [RequestHeaderInterceptor],
  exports: [RequestHeaderInterceptor],
})
export class InterceptorsModule {}
