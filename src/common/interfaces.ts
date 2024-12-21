import { EachDayInfo } from './models/eachDayInfo.model';

export interface SlotTimings {
  slotDuration: number;
  eachDayInfo: EachDayInfo[];
}

export interface FeeFollowups {
  appointmentFee: number;
  emergencyFee: number;
  // followupFee: number;
  // followupDays: number;
}
