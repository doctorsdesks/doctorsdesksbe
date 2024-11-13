import { IsObject } from 'class-validator';
import { FeeFollowups, SlotTimings } from 'src/common/interfaces';
import { ClinicAddress } from 'src/common/models/clinicAddress.model';

export class UpdateClinicDto {
  @IsObject()
  readonly addressPayload?: ClinicAddress;

  @IsObject()
  readonly timingPayload?: SlotTimings;

  @IsObject()
  readonly feeFollowupPayload?: FeeFollowups;
}
