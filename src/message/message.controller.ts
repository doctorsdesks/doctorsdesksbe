import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { MessageService } from './message.service';

@Controller('/v1/message')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('trigger_otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.messageService.sendOtp(phoneNumber);
  }

  @Post('verify_otp')
  async verifyOtp(@Body() body: { phoneNumber: string; code: string }) {
    return this.messageService.verifyOtp(body.phoneNumber, body.code);
  }
}
