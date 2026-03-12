import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactUsDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  message: string;

  constructor(phone: string, name: string, email: string, message: string) {
    this.phone = phone;
    this.name = name;
    this.email = email;
    this.message = message;
  }
}
