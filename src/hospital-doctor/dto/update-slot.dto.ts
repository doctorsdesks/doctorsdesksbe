import { IsMongoId, IsNumber, Min } from 'class-validator';

export class UpdateSlotDto {
  @IsMongoId()
  mappingId: string;

  @IsNumber()
  @Min(5)
  slotDuration: number;
}
