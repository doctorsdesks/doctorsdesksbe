import { IsNotEmpty, IsString } from 'class-validator';

export class GetConfigDto {
  @IsNotEmpty()
  @IsString()
  type: string;
}
