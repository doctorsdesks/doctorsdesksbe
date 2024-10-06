import { Address } from "./address.model";

export class ClinicAddress {
    clinicName: string;
    address: Address;

    constructor(clinicName: string, address: Address){
        this.clinicName = clinicName;
        this.address = address;
    }
}