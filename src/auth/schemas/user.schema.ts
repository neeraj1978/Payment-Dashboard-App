import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document; // MongoDB Document type

@Schema() // Yeh batata hai ki yeh ek Mongoose Schema hai
export class User {
  @Prop({ unique: true, required: true }) // Username unique aur required hoga
  username: string;

  @Prop({ required: true }) // Password required hoga
  password: string;

  @Prop({ enum: ['admin', 'viewer'], default: 'viewer' }) // User roles define karte hain [cite: 52]
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);