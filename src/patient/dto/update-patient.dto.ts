import { IsNotEmpty, IsString } from 'class-validator';
import { Address } from 'src/common/models/address.model';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string;

  @IsString()
  readonly alternatePhone: string;

  @IsString()
  readonly maritalStatus: string;

  @IsString()
  readonly emailId: string;

  @IsString()
  readonly address: Address;
}
