import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationToken } from './schemas/notification-token.schema';
import { CreateTokenDto } from './dto/create-token.dto';
import { Expo } from 'expo-server-sdk';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationCategory, UserType } from 'src/common/enums';
import { User } from 'src/users/schemas/user.schema';
import { NotificationUser } from 'src/common/interfaces';

@Injectable()
export class NotificationTokenService {
  private readonly logger = new Logger(NotificationTokenService.name);
  private expo: Expo;

  constructor(
    @InjectModel(NotificationToken.name)
    private readonly tokenModel: Model<NotificationToken>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly notificationsService: NotificationService,
  ) {
    this.expo = new Expo({}); // default
  }

  /**
   * Upsert token by (userId, deviceId) — ensures one record per device.
   */
  async upsertToken(
    dto: CreateTokenDto,
  ): Promise<{ success: boolean; message: string }> {
    const { userId, deviceId, pushToken } = dto;

    // Basic validation of token format (Expo tokens start with "ExponentPushToken")
    if (!Expo.isExpoPushToken(pushToken)) {
      this.logger.warn('Invalid Expo push token: ' + pushToken);
      throw new HttpException(
        'Invalid Expo push token',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    // Upsert: update existing device doc or insert
    await this.tokenModel
      .findOneAndUpdate(
        { userId, deviceId },
        { pushToken, active: true },
        { upsert: true, new: true },
      )
      .exec();

    return {
      success: true,
      message: 'Token and device has been saved successfully!',
    };
  }

  /**
   * Remove device token (on logout or app uninstall signal).
   */
  async removeToken(userId: string, deviceId: string) {
    await this.tokenModel.deleteOne({ userId, deviceId }).exec();
    return { success: true };
  }

  /**
   * Build messages and send them in bulk.
   * Accepts userIds[] OR pushTokens[]. If userIds given, we fetch active tokens.
   *
   * Uses expo-server-sdk to chunk messages and collect tickets.
   */
  async sendNotification(payload: {
    user: NotificationUser;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    const { user, title, body, data } = payload;

    // 1) Resolve tokens
    let tokens: string[] = [];
    let userId: string = '';

    const userFromUser = await this.userModel
      .findOne({
        phone: user.phone,
        userType: UserType[user.type],
      })
      .exec();
    console.log('3. got user with userId', userFromUser, userFromUser.id);
    userId = userFromUser.id;

    const docs = await this.tokenModel
      .find({ userId: userId, active: true })
      .lean()
      .exec();
    console.log('4. got docs with userId', docs);
    tokens = docs.map((d) => d.pushToken);
    console.log('5. got tokens with userId', tokens, tokens[0]);

    // 2) Deduplicate tokens (same device might appear multiple times)
    tokens = Array.from(new Set(tokens));
    console.log('6. got tokens with userId', tokens, tokens[0]);

    // Create notification in notification table for the user
    const notification = await this.notificationsService.create({
      userId,
      title,
      body,
      category:
        NotificationCategory[data?.category] || NotificationCategory.GENERAL,
      metadata: data || {},
      icon: data?.icon,
    });

    console.log('7. notification created', notification, notification.id);

    const notificationId = notification.id;

    const metaData = { ...data };
    metaData.notificationId = notificationId;
    metaData.category = data?.category || NotificationCategory.GENERAL;

    // 3) Prepare messages array
    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: metaData || {},
    }));

    console.log('8. messages created', messages, messages[0]);

    // 4) Filter invalid tokens before sending (expo-server-sdk helper)
    const validMessages = [];
    for (const msg of messages) {
      if (!Expo.isExpoPushToken(msg.to)) {
        this.logger.warn('Skipping invalid token: ' + msg.to);
        // optionally mark token inactive in DB
        await this.tokenModel
          .updateOne({ pushToken: msg.to }, { active: false })
          .exec();
        continue;
      }
      validMessages.push(msg);
    }

    if (validMessages.length === 0) {
      return { success: false, message: 'No valid tokens to send' };
    }

    console.log('9. valid messages created', validMessages, validMessages[0]);

    // 5) Chunk messages and send
    const chunks = this.expo.chunkPushNotifications(validMessages);

    const tickets: any[] = []; // collect tickets to check later for receipts
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        this.logger.error('Error sending push chunk', error);
        // continue with other chunks
      }
    }

    // 6) Process tickets: tickets may contain { id, status, message, details }
    // You should keep ticket IDs and later query receipts using expo.getPushNotificationReceiptsAsync()
    // For brevity, we return the tickets here.
    return { success: true, tickets, totalSent: validMessages.length };
  }

  /**
   * Optional: check receipts using stored ticket IDs
   * - ticketIds[] are the ids from tickets returned by sendPushNotificationsAsync
   */
  async checkReceipts(ticketIds: string[]) {
    // expo.getPushNotificationReceiptsAsync expects an array of ticket IDs
    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(ticketIds);
    const receipts = [];

    for (const chunk of receiptIdChunks) {
      try {
        const recv = await this.expo.getPushNotificationReceiptsAsync(chunk);
        receipts.push(recv);
      } catch (error) {
        this.logger.error('Error getting receipts', error);
      }
    }

    // Inspect receipts to detect invalid/expired tokens and mark them inactive in DB if necessary
    // receipts is an array of objects keyed by ticket id
    // Example receipt structure:
    // { [ticketId]: { status: 'ok' } } or { [ticketId]: { status: 'error', details: { error: 'DeviceNotRegistered' } } }
    return receipts;
  }
}
