import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dfo, DfoSchema } from './schemas/dfo.schema';
import { DfoService } from './dfo.service';
import { DfoController } from './dfo.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dfo.name, schema: DfoSchema }]),
    UserModule,
  ],
  exports: [DfoService],
  providers: [DfoService],
  controllers: [DfoController],
})
export class DfoModule {}
