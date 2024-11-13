export class Address {
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;

  constructor(
    addressLine: string,
    landmark: string,
    city: string,
    state: string,
    pincode: string,
  ) {
    this.addressLine = addressLine;
    this.landmark = landmark || '';
    this.city = city;
    this.state = state;
    this.pincode = pincode;
  }
}
