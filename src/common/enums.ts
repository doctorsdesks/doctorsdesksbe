// import { ClinicAddress } from './models/clinicAddress.model';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

export enum PatientType {
  PRIMARY = 'PRIMARY',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
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

export enum AppointmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum AppointmentType {
  OPD = 'OPD',
  EMERGENCY = 'EMERGENCY',
}

export enum OPDAppointmentType {
  NEW = 'NEW',
  FOLLOW_UP = 'FOLLOWUP',
}

export enum AppointmentByType {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export enum AppointmentUpdateType {
  ACCEPT = 'ACCEPT',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export enum BannerType {
  APP_UPDATE = 'APP_UPDATE',
  NOT_VERIFIED = 'NOT_VERIFIED',
  DEFAULT = 'DEFAULT',
}

export enum ButtonType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
}
