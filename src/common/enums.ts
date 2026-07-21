// import { ClinicAddress } from './models/clinicAddress.model';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
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
  ADMIN = 'ADMIN',
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

export enum NotificationCategory {
  GENERAL = 'GENERAL',
  APPOINTMENT_REQUEST = 'APPOINTMENT_REQUEST',
  APPOINTMENT_STATUS = 'APPOINTMENT_STATUS',
  DOCTOR_JOINING_REQUEST = 'DOCTOR_JOINING_REQUEST',
  DOCTOR_JOINING_STATUS = 'DOCTOR_JOINING_STATUS',
  HOSPITAL_ANNOUNCEMENT = 'HOSPITAL_ANNOUNCEMENT',
}

export enum NotificationActionCategory {
  NONE = 'NONE',
  APPOINTMENT_REQUEST_ACTIONS = 'APPOINTMENT_REQUEST_ACTIONS',
  DOCTOR_JOINING_REQUEST_ACTIONS = 'DOCTOR_JOINING_REQUEST_ACTIONS',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum DoctorHospitalRole {
  PRIMARY_DOCTOR = 'PRIMARY_DOCTOR',
  CONSULTANT = 'CONSULTANT',
  VISITING_DOCTOR = 'VISITING_DOCTOR',
  STAFF_DOCTOR = 'STAFF_DOCTOR',
}

export const DoctorRolesType = {
  PRIMARY_DOCTOR: 'Primary Doctor',
  CONSULTANT: 'Consultant',
  VISITING_DOCTOR: 'Visiting Doctor',
  STAFF_DOCTOR: 'Staff Doctor',
};
