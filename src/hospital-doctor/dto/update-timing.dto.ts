import { IsArray, IsMongoId } from 'class-validator';

export class UpdateTimingDto {
  @IsMongoId()
  mappingId: string;

  @IsArray()
  doctorTimings: any[];
}
