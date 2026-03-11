export function createDoctorId(phone: string): string {
  const doctorId = `Dr-${phone}`;

  return doctorId;
}

export function reverseDate(date: string): string {
  // date :: 2025-11-29
  const [YYYY, MM, DD] = date?.split('-');
  return DD + '-' + MM + '-' + YYYY;
}
