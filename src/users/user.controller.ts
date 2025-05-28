import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { UserType } from 'src/common/enums';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@Controller('/v1/user')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
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

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('/logout')
  async logout(@Body() logoutUserDto: LogoutUserDto) {
    return this.userService.logout(logoutUserDto.phone, logoutUserDto.type);
  }

  @Post('reset_password')
  async resetPassword(@Body() resetPasswordDto: CreateUserDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('push_token')
  async savePushToken(@Body() dto: UpdatePushTokenDto) {
    return this.userService.savePushToken(dto.phone, dto.token, dto.userType);
  }
}
