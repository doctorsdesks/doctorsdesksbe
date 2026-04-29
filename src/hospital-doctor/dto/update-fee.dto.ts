import { IsMongoId, IsNumber, Min } from 'class-validator';

export class UpdateFeeDto {
  @IsMongoId()
  mappingId: string;

  @IsNumber()
  @Min(0)
  appointmentFee: number;

  @IsNumber()
  @Min(0)
  emergencyFee: number;
}
