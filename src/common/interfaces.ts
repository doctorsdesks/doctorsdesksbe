import { BannerType, ButtonType } from './enums';
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

export interface ButtonDataType {
  type: ButtonType;
  label: string;
  isHidden: boolean;
  isDisabled: boolean;
  pathToGo?: string;
}

export interface BannerData {
  id: string;
  label: string;
  subLabel: string;
  bannerType: BannerType;
  buttonData: ButtonDataType;
  isHidden: boolean;
}
