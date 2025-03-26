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
import { UserType } from 'src/common/enums';

export interface CreateResponse {
  status: string;
  phone: string;
}

export interface GetUser {
  phone: string;
  userType: UserType;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateResponse> {
    try {
      const user = new this.userModel(createUserDto);
      const createdUser = await user.save();
      return {
        status: "Success",
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

  async getPatient(phone: string): Promise<GetUser> {
    const user = await this.userModel.findOne({ phone: phone, userType: UserType.PATIENT }).exec();
    if (!user) {
      return null;
    }
    return {
      phone: user?.phone,
      userType: UserType[user?.userType],
    }
  }
}
