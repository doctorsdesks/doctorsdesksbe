import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsMongoId()
  @IsNotEmpty()
  mappingId: string;

  @IsBoolean()
  status: boolean;
}
