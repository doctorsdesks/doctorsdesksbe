export function createDoctorId(phone: string): string {
  const doctorId = `Dr-${phone}`;

  return doctorId;
}

export function reverseDate(date: string): string {
  // date :: 2025-11-29
  const [YYYY, MM, DD] = date?.split('-');
  return DD + '-' + MM + '-' + YYYY;
}

export function formatTimeTo12Hour(time) {
  const [hours, minutes] = time.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
