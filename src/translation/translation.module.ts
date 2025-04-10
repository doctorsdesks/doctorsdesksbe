import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Translation, TranslationSchema } from './schemas/translation.schema';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [TranslationController],
  providers: [TranslationService],
  imports: [
    MongooseModule.forFeature([
      { name: Translation.name, schema: TranslationSchema },
    ]),
    UserModule,
  ],
  exports: [TranslationService],
})
export class TranslationModule {}
