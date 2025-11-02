import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationToken,
  NotificationTokenSchema,
} from './schemas/notification-token.schema';
import { NotificationTokenService } from './notification-token.service';
import { NotificationTokenController } from './notification-token.controller';
import { UserModule } from 'src/users/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationToken.name, schema: NotificationTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    NotificationModule,
  ],
  exports: [NotificationTokenService],
  providers: [NotificationTokenService],
  controllers: [NotificationTokenController],
})
export class NotificationTokenModule {}
