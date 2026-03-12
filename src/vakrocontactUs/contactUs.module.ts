import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsController } from './contactus.controller';
import { ContactUsService } from './contactus.service';
import { ContactUs, ContactUsSchema } from './schemas/contactUs.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ContactUs.name, schema: ContactUsSchema }],
      'SECONDARY_DB',
    ),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
