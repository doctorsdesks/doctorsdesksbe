import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/common/enums';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly type: UserType;

  constructor(phone: string, password: string, type: UserType) {
    this.phone = phone;
    this.password = password;
    this.type = type;
  }
}
