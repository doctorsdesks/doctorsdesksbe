import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateDfoDto {
  @IsObject()
  @IsNotEmpty()
  readonly dfo: object;
}
