import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(phone: string, password: string) {
    this.phone = phone;
    this.password = password;
  }
}
