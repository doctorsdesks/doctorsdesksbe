import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/common/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly userType: UserType;

  constructor(
    phone: string,
    password: string,
    userType: UserType,
  ) {
    this.phone = phone;
    this.password = password;
    this.userType = UserType[userType];
  }
}
