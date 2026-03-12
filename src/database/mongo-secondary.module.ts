import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'SECONDARY_DB',
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.M2_UN}:${process.env.M2_PW}@vakropharma.qzygq1e.mongodb.net/${process.env.M2_DB}?retryWrites=true&w=majority&appName=vakropharma`,
      }),
    }),
  ],
})
export class MongoSecondaryModule {}
