import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserType } from 'src/common/enums';

export interface CreateResponse {
  status: string;
  phone: string;
}

export interface GetUser {
  phone: string;
  userType: UserType;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    phone: string;
    userType: UserType;
  };
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateResponse> {
    try {
      const user = new this.userModel(createUserDto);
      const createdUser = await user.save();
      return {
        status: 'Success',
        phone: createdUser?.phone,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `User is already exist with ${createUserDto.phone}`,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(phone: string, type: UserType): Promise<GetUser> {
    const user = await this.userModel
      .findOne({ phone: phone, userType: type })
      .exec();
    if (!user) {
      return null;
    }
    return {
      phone: user?.phone,
      userType: UserType[user?.userType],
    };
  }

  async loginPatient(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.userModel
        .findOne({ phone: loginUserDto.phone, userType: UserType.PATIENT })
        .exec();

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const isPasswordValid = loginUserDto.password === user.password;

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      return {
        success: true,
        message: 'Login successful',
        user: {
          phone: user.phone,
          userType: UserType[user.userType],
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error during login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
