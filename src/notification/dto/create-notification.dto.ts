import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  NotificationActionCategory,
  NotificationCategory,
} from 'src/common/enums';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  category: NotificationCategory;

  @IsString()
  @IsNotEmpty()
  actionCategory: NotificationActionCategory;
}
