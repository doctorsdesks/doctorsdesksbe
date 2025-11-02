import { IsString } from 'class-validator';

export class DeleteTokenDto {
  @IsString()
  userId: string;

  @IsString()
  deviceId: string;
}
