import { IsObject, IsOptional } from 'class-validator';
import { FeeFollowups, SlotTimings } from 'src/common/interfaces';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';

export class UpdateClinicDto {
  @IsOptional()
  @IsObject()
  readonly addressPayload?: ClinicAddress;

  @IsOptional()
  @IsObject()
  readonly timingPayload?: SlotTimings;

  @IsOptional()
  @IsObject()
  readonly feeFollowupPayload?: FeeFollowups;
}
