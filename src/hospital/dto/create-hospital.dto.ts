import { IsString, IsNotEmpty, IsEmail, IsObject } from 'class-validator';
import { Address } from 'src/common/models/address.model';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsObject()
  @IsNotEmpty()
  readonly address: Address;

  constructor(
    phone: string,
    password: string,
    name: string,
    email: string,
    address: Address,
  ) {
    this.phone = phone;
    this.password = password;
    this.name = name;
    this.email = email;
    this.address = address;
  }
}
