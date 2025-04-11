import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/user.module';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { DfoModule } from 'src/dfo/dfo.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    UserModule,
    DfoModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
