import { IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/common/enums';

export class GetBannerDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  type: UserType;
}
