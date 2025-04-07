import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserType } from 'src/common/enums';

@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/patient/:phone')
  getUserAsPatient(@Param('phone') phone: string) {
    return this.userService.getUser(phone, UserType.PATIENT);
  }

  @Get('/doctor/:phone')
  getUserAsDoctor(@Param('phone') phone: string) {
    return this.userService.getUser(phone, UserType.DOCTOR);
  }

  @Post('/patientLogin')
  async loginPatient(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginPatient(loginUserDto);
  }
}
