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
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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
    authToken?: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Encrypts a password using bcrypt
   * @param password Plain text password
   * @returns Encrypted password
   */
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateResponse> {
    try {
      // Encrypt the password before saving
      const encryptedPassword = await this.encryptPassword(
        createUserDto.password,
      );

      // Create a new user with the encrypted password
      const user = new this.userModel({
        ...createUserDto,
        password: encryptedPassword,
      });

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

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.userModel
        .findOne({
          phone: loginUserDto.phone,
          userType: UserType[loginUserDto.type],
        })
        .exec();

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Compare the provided password with the stored encrypted password
      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Generate a new auth token
      const authToken = uuidv4();

      // Update user with auth token and lastLoggedIn date
      user.authToken = authToken;
      user.lastLoggedIn = new Date();
      user.isLoggedIn = true;
      await user.save();

      return {
        success: true,
        message: 'Login successful',
        user: {
          phone: user.phone,
          userType: UserType[user.userType],
          authToken: authToken,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error during login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates an auth token
   * @param authToken The auth token to validate
   * @returns True if the token is valid and the user is logged in, false otherwise
   */
  async validateAuthToken(authToken: string): Promise<boolean> {
    try {
      const user = await this.userModel
        .findOne({ authToken: authToken, isLoggedIn: true })
        .exec();

      return !!user; // Return true if user exists, false otherwise
    } catch {
      return false;
    }
  }

  /**
   * Logs out a user by clearing their auth token and updating lastLoggedOut
   * @param phone Phone number of the user
   * @param type User type (PATIENT, DOCTOR, etc.)
   * @returns Object containing success status and message
   */
  async logout(phone: string, type: UserType): Promise<LogoutResponse> {
    try {
      const user = await this.userModel
        .findOne({
          phone: phone,
          userType: type,
        })
        .exec();

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Update user with empty auth token and lastLoggedOut date
      user.authToken = '';
      user.lastLoggedOut = new Date();
      user.isLoggedIn = false;
      await user.save();

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      throw new HttpException(
        `Error during logout: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes a user by phone number and user type
   * @param phone Phone number of the user to delete
   * @param type User type (PATIENT, DOCTOR, etc.)
   * @returns Object containing success status and message
   */
  async deleteUser(
    phone: string,
    type: UserType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Find and delete the user
      const result = await this.userModel
        .findOneAndDelete({ phone, userType: type })
        .exec();

      // Check if a user was actually deleted
      if (!result) {
        return {
          success: false,
          message: `User not found with phone ${phone} and type ${type}`,
        };
      }

      return {
        success: true,
        message: `User with phone ${phone} and type ${type} has been deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
