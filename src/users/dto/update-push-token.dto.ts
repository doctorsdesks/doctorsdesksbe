import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/common/enums';

export class UpdatePushTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  readonly userType: UserType;

  constructor(phone: string, token: string, userType: UserType) {
    this.phone = phone;
    this.token = token;
    this.userType = UserType[userType];
  }
}
