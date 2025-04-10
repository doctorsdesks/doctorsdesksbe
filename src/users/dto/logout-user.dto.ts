import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/common/enums';

export class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly type: UserType;

  constructor(phone: string, type: UserType) {
    this.phone = phone;
    this.type = type;
  }
}
