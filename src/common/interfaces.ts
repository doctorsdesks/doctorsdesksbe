import { EachDayInfo } from './models/eachDayInfo.model';

export interface SlotTimings {
  slotDuration: number;
  eachDayInfo: EachDayInfo[];
}

export interface FeeFollowups {
  appointmentFee: number;
  // followupFee: number;
  // followupDays: number;
}
