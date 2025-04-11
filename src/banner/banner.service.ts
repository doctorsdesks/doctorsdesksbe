import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './schemas/banner.schema';
import { UserType } from 'src/common/enums';
import { DfoService } from 'src/dfo/dfo.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<Banner>,
    private readonly dfoService: DfoService,
  ) {}

  async getBanner(phone: string, userType: UserType): Promise<any> {
    try {
      // Get all banners for the user type
      const banner = await this.bannerModel.findOne({ userType }).exec();

      if (!banner) {
        throw new HttpException(
          `No banner found for type: ${userType}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // If it's a doctor, filter banners based on DFO bannerIds
      if (userType === UserType.DOCTOR) {
        try {
          // Get the DFO for the doctor
          const dfo = await this.dfoService.getDfo(phone);

          // Check if dfo has bannerIds
          if (
            dfo &&
            dfo.dfo &&
            dfo.dfo['bannerIds'] &&
            Array.isArray(dfo.dfo['bannerIds'])
          ) {
            const bannerIds = dfo.dfo['bannerIds'];

            // Filter banners to only include those in the bannerIds array
            const filteredBanners = banner.banners.filter((bannerItem) =>
              bannerIds.includes(bannerItem.id),
            );

            // Return a copy of the banner with filtered banners
            return {
              ...banner.toObject(),
              banners: filteredBanners,
            };
          }
        } catch (dfoError) {
          // If DFO not found or other error, just return all banners
          console.log(`DFO error: ${dfoError.message}. Returning all banners.`);
        }
      }

      // Return all banners if not a doctor or if DFO doesn't have bannerIds
      return banner;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error retrieving banner: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
