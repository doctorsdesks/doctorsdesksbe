import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/users/schemas/user.schema';
import { UserType } from 'src/common/enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createDto);
    return notification.save();
  }

  async findByUser(phone: string, type: string) {
    const user = await this.userModel
      .findOne({
        phone: phone,
        userType: UserType[type],
      })
      .exec();
    const userId = user.id;
    const notification = this.notificationModel.find({ userId: userId }).exec();
    return notification;
  }

  async markAsRead(id: string) {
    return this.notificationModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
  }
}
