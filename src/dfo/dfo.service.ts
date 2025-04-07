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
      await createdDfoSchema.save();
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
      return `Updated successfully.`;
    } else {
      const newDfoObject = { ...currentDfo.dfo, ...updateDfo };
      const addDfoDto = new CreateDfoDto(doctorId, newDfoObject);
      await this.dfoModel.findOneAndUpdate({ doctorId }, addDfoDto).exec();
      return `Updated successfully.`;
    }
  }

  async getDfo(doctorId: string): Promise<CreateDfoDto | null> {
    try {
      const dfo = await this.dfoModel.findOne({ doctorId }).exec();
      if (dfo === null) {
        throw new HttpException(
          `Dfo not found for this ${doctorId}`,
          HttpStatus.NOT_FOUND,
        );
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

  async deleteDfo(doctorId: string, dfoKey: string): Promise<string> {
    try {
      const currentDfo = await this.dfoModel
        .findOne({ doctorId: doctorId })
        .exec();
      if (!currentDfo) {
        throw new HttpException(
          `Dfo not found for this ${doctorId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const dfo = currentDfo.dfo;
      if (dfo[dfoKey]) {
        delete dfo[dfoKey];
        currentDfo.dfo = dfo;
        currentDfo.markModified('dfo');
        await currentDfo.save();
        return `${dfoKey} deleted successfully`;
      } else {
        throw new HttpException(`${dfoKey} not present`, HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes the entire DFO document for a doctor
   * @param doctorId Doctor ID to delete DFO for
   * @returns Object containing success status and message
   */
  async deleteDfoDocument(
    doctorId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.dfoModel.findOneAndDelete({ doctorId }).exec();

      if (!result) {
        return {
          success: false,
          message: `DFO not found for doctor with ID ${doctorId}`,
        };
      }

      return {
        success: true,
        message: `DFO for doctor with ID ${doctorId} has been deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting DFO: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
