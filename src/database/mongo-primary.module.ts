import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.M_UN}:${process.env.M_PW}@doctorsdesks.nwle1.mongodb.net/doctorsdesks?retryWrites=true&w=majority&appName=doctorsdesks`,
      }),
    }),
  ],
})
export class MongoPrimaryModule {}
