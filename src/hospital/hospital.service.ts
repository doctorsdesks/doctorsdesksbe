import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from './schemas/hospital.schema';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/user.service';
import { UserType } from 'src/common/enums';

@Injectable()
export class HospitalService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
  ) {}

  async createHospital(
    createHospitalDto: CreateHospitalDto,
  ): Promise<Hospital> {
    try {
      const user = new CreateUserDto(
        createHospitalDto?.phone,
        createHospitalDto?.password,
        UserType.ADMIN,
      );
      const userResponse = await this.userService.createUser(user);

      if (userResponse.status !== 'Success') {
        console.error('Failed to create user account:', userResponse);
        throw new HttpException(
          'Failed to create user account',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newHospital = new this.hospitalModel(createHospitalDto);
      const hospital = await newHospital.save();
      return hospital;
    } catch (error) {
      console.info('eroor while creating hospital', error);
      if (error.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new ConflictException(
          `Account is already exist with ${createHospitalDto.phone}`,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Array<Hospital>> {
    const hospitals = await this.hospitalModel.find().exec();
    return hospitals;
  }

  async findByPhone(phone: string): Promise<Hospital> {
    const hospital = await this.hospitalModel.findOne({ phone }).exec();
    if (!hospital) {
      return null;
    }
    return hospital;
  }

  /**
   * Deletes a hospital by phone number
   * @param phone Phone number of the hospital to delete
   * @returns Object containing success status and message
   */
  async deleteHospital(
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.hospitalModel
        .findOneAndDelete({ phone })
        .exec();

      if (!result) {
        return {
          success: false,
          message: `Hospital not found with phone ${phone}`,
        };
      }

      return {
        success: true,
        message: `Hospital with phone ${phone} has been deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting hospital: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
