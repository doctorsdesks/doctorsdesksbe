import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationToken extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  pushToken: string; // Expo push token (ExponentPushToken[xxxx])

  @Prop({ required: true, index: true })
  deviceId: string; // unique per device (app must send this)

  @Prop({ default: true })
  active: boolean; // allow soft-disable if push fails repeatedly
}

export const NotificationTokenSchema =
  SchemaFactory.createForClass(NotificationToken);
