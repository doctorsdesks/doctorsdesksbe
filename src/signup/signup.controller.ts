import { Body, Controller, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { SignupService } from './signup.service';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';

@Controller('/v1/signup')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class SignupController {
    constructor(
        private readonly signupSevice: SignupService
    ) {}
    @Post("/doctor")
    doctorSignup(@Body() signupDoctorDto: SignupDoctorDto){
        console.log("Signup Doctor - start with signUpInfo: ", signupDoctorDto);
        return this.signupSevice.signupDoctor(signupDoctorDto);
    };
}

