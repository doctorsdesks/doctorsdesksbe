import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/patient/:phone')
  getPatient(@Param('phone') phone: string) {
    return this.userService.getPatient(phone);
  }
}
