import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationCategory } from 'src/common/enums';

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
  metadata?: Record<string, any>;

  @IsOptional()
  category?: NotificationCategory;
}
