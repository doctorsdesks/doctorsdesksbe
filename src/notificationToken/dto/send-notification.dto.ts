import { IsOptional, IsString, IsObject } from 'class-validator';
import { NotificationUser } from 'src/common/interfaces';

export class SendNotificationDto {
  @IsObject()
  user: NotificationUser;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  data?: Record<string, any>;
}
