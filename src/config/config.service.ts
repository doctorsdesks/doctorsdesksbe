import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from './schemas/config.schema';

@Injectable()
export class ConfigService {
  constructor(@InjectModel(Config.name) private configModel: Model<Config>) {}

  async getConfigByType(type: string): Promise<any> {
    try {
      const config = await this.configModel.findOne({ type }).exec();

      if (!config) {
        throw new HttpException(
          `No configuration found for type: ${type}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        type: config.type,
        data: config.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error retrieving configuration: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
