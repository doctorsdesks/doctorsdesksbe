import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://doctorsdesks:3OBIIkhRR8YJ9LXJ@doctorsdesks.nwle1.mongodb.net/doctorsdesks?retryWrites=true&w=majority&appName=doctorsdesks'
    ), // Replace with your MongoDB connection string
  ],
})
export class DatabaseModule {}
