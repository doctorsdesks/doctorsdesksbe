import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load .env variables globally
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.M_UN}:${process.env.M_PW}@doctorsdesks.nwle1.mongodb.net/doctorsdesks?retryWrites=true&w=majority&appName=doctorsdesks`,
    ), // Replace with your MongoDB connection string
  ],
})
export class DatabaseModule {}
