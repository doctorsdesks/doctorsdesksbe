import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string;
}
