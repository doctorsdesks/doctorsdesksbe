// import { ClinicAddress } from './models/clinicAddress.model';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatus {
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  BLOCKED = 'BLOCKED',
}

export enum Specialisation {
  DERMATOLOGY = 'DERMATOLOGY',
  HEART = 'HEART',
  GENERAL = 'GENERAL',
}

export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum SlotStatus {
  OPEN = 'OPEN',
  BOOKED = 'BOOKED',
  LOCKED = 'LOCKED',
}
