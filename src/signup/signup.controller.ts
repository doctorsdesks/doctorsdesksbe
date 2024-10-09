import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { SignupService } from './signup.service';

@Controller('/v1/signup')
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

