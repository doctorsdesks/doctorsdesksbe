import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load .env variables globally
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.M2_UN}:${process.env.M2_PW}@vakropharma.qzygq1e.mongodb.net/`,
      {
        connectionName: 'SECONDARY_DB',
      },
    ),
  ],
})
export class MongoSecondaryModule {}
