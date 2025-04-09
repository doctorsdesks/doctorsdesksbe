import { EachDayInfo } from './models/eachDayInfo.model';

export interface SlotTimings {
  slotDurationNormal: number;
  eachDayInfoNormal: EachDayInfo[];
  slotDurationEmergency: number;
  eachDayInfoEmergency: EachDayInfo[];
}

export interface FeeFollowups {
  appointmentFee: number;
  emergencyFee: number;
  // followupFee: number;
  // followupDays: number;
}
