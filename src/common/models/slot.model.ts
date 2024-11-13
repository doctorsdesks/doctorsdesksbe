import { SlotStatus } from '../enums';

export class Slot {
  startTime: string;
  endTime: string;
  slotStatus?: SlotStatus;

  constructor(startTime: string, endTime: string, slotStatus: SlotStatus) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.slotStatus = slotStatus || SlotStatus.OPEN;
  }
}
