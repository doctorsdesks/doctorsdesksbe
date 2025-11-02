import {
  Body,
  Controller,
  Delete,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationTokenService } from './notification-token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { DeleteTokenDto } from './dto/delete-token.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('v1/notification-token')
@UseFilters(HttpExceptionFilter)
export class NotificationTokenController {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  // Save or update a device token
  @Post('token')
  @UseInterceptors(RequestHeaderInterceptor)
  async saveToken(@Body() dto: CreateTokenDto) {
    return this.notificationTokenService.upsertToken(dto);
  }

  // Remove a token (eg: on logout)
  @Delete('token')
  @UseInterceptors(RequestHeaderInterceptor)
  async deleteToken(@Body() dto: DeleteTokenDto) {
    return this.notificationTokenService.removeToken(dto.userId, dto.deviceId);
  }

  // Send bulk notification (single API call sends to many devices)
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationTokenService.sendNotification(dto);
  }
}
