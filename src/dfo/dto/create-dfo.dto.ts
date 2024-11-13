import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateDfoDto {
  @IsString()
  @IsNotEmpty()
  readonly doctorId: string;

  @IsObject()
  @IsNotEmpty()
  readonly dfo: object;

  constructor(doctorId: string, dfo: object) {
    this.doctorId = doctorId;
    this.dfo = dfo;
  }
}
