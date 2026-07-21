import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  NotificationActionCategory,
  NotificationCategory,
} from 'src/common/enums';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: null })
  image?: string; // optional thumbnail or image for notification

  @Prop({ default: null })
  icon?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>; // can store deep links, entityId, etc.

  @Prop({ default: false })
  isRead: boolean;

  @Prop({
    default: NotificationCategory.GENERAL,
  })
  category: NotificationCategory; // classify notification type

  @Prop({
    default: NotificationActionCategory.NONE,
  })
  actionCategory: NotificationActionCategory;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
