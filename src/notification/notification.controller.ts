import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  UseFilters,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';

@Controller('v1/notifications')
@UseFilters(HttpExceptionFilter)
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get('all')
  @UseInterceptors(RequestHeaderInterceptor)
  async findByUser(@Query('phone') phone: string, @Query('type') type: string) {
    return this.notificationsService.findByUser(phone, type);
  }

  @Patch(':id/read')
  @UseInterceptors(RequestHeaderInterceptor)
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
