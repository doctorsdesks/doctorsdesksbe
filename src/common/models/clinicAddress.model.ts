import { Address } from './address.model';

export class ClinicAddress {
  clinicName: string;
  address: Address;

  constructor(clinicName: string, address: Address) {
    this.clinicName = clinicName;
    this.address = address;
  }

  validate(): string[] {
    const errors: string[] = [];

    // 1. clinicName should be present and not empty.
    if (!this.clinicName || this.clinicName.trim() === '') {
      errors.push('clinicName should be present and not empty.');
    }

    // 2. address should be present.
    if (!this.address) {
      errors.push('address should be present.');
    } else {
      // 3. addressLine, city, and state should be present and not empty.
      if (!this.address.addressLine || this.address.addressLine.trim() === '') {
        errors.push('addressLine should be present and not empty.');
      }
      if (!this.address.city || this.address.city.trim() === '') {
        errors.push('city should be present and not empty.');
      }
      if (!this.address.state || this.address.state.trim() === '') {
        errors.push('state should be present and not empty.');
      }

      // 4. landmark should be present.
      if (this.address.landmark === undefined) {
        errors.push('landmark should be present.');
      }

      // 5. pincode should be present, not empty, and 6 digits long.
      const pincode = this.address.pincode;
      if (!pincode || pincode.trim() === '' || !/^\d{6}$/.test(pincode)) {
        errors.push('pincode should be present, not empty, and 6 digits long.');
      }
    }

    return errors;
  }
}
