export function createDoctorId(phone: string): string {
  const doctorId = `Dr-${phone}`;

  return doctorId;
}
