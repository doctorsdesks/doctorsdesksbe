import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Translation } from './schemas/translation.schema';

@Injectable()
export class TranslationService {
  constructor(
    @InjectModel(Translation.name) private translationModel: Model<Translation>,
  ) {}

  async getTranslations(): Promise<object> {
    try {
      const translations: Array<Translation> = await this.translationModel
        .find()
        .exec();
      let finalTranslations = {};
      translations.forEach((translation) => {
        finalTranslations = {
          ...finalTranslations,
          [translation.language]: translation.translation,
        };
      });
      return finalTranslations;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
