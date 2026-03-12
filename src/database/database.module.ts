import { Module } from '@nestjs/common';
import { MongoPrimaryModule } from './mongo-primary.module';
import { MongoSecondaryModule } from './mongo-secondary.module';

@Module({
  imports: [MongoPrimaryModule, MongoSecondaryModule],
  exports: [MongoPrimaryModule, MongoSecondaryModule],
})
export class DatabaseModule {}
