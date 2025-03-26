import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/patient/:phone')
  getUserAsPatient(@Param('phone') phone: string) {
    return this.userService.getUserAsPatient(phone);
  }

  @Post('/patientLogin')
  async loginPatient(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginPatient(loginUserDto);
  }
}
