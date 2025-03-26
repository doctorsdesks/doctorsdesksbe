import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from 'src/common/enums';

@Schema({ timestamps: true }) // Enable timestamps
export class User extends Document {
  @Prop({ type: String, required: true, index: true, unique: true })
  phone: string;

  @Prop({ type: String, required: true, })
  password: string;

  @Prop({ type: String, enum: Object.values(UserType), required: true })
  userType: string;

  // createAt and updatedAt will be added automatically by mongo.
}

export const UserSchema = SchemaFactory.createForClass(User);
