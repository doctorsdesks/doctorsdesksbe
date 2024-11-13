import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dfo } from './schemas/dfo.schema';
import { Model } from 'mongoose';
import { CreateDfoDto } from './dto/create-dfo.dto';
import { dfoInitial } from 'src/common/constant';

@Injectable()
export class DfoService {
  constructor(@InjectModel(Dfo.name) private dfoModel: Model<Dfo>) {}

  async createDfo(createDfo: CreateDfoDto) {
    try {
      const createdDfoSchema = new this.dfoModel(createDfo);
      const createdDfo = await createdDfoSchema.save();
      console.log('Created dfo for doctor:', createdDfo);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addDfo(doctorId: string, updateDfo: object): Promise<string> {
    const currentDfo = await this.dfoModel
      .findOne({ doctorId: doctorId })
      .exec();
    if (currentDfo === null) {
      // new user adding dfo first time
      const createDfoDto = new CreateDfoDto(doctorId, {
        ...dfoInitial,
        ...updateDfo,
      });
      this.createDfo(createDfoDto);
      console.log('New dfo for new doctor:', doctorId);
      return `Updated successfully.`;
    } else {
      const newDfoObject = { ...currentDfo.dfo, ...updateDfo };
      const addDfoDto = new CreateDfoDto(doctorId, newDfoObject);
      const updatedDfo = await this.dfoModel
        .findOneAndUpdate({ doctorId }, addDfoDto)
        .exec();
      console.log('New dfo for doctor:', doctorId, updatedDfo);
      return `Updated successfully.`;
    }
  }

  async getDfo(doctorId: string): Promise<CreateDfoDto | null> {
    try {
      const dfo = await this.dfoModel.findOne({ doctorId }).exec();
      if (dfo === null) {
        return null;
      } else {
        const doctorId = dfo.doctorId;
        const dfoObject = dfo.dfo;
        const objectToReturn = new CreateDfoDto(doctorId, dfoObject);
        return objectToReturn;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
