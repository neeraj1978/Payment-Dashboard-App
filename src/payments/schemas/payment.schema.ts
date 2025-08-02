import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true }) // timestamps: true se createdAt aur updatedAt auto add honge
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  receiver: string;

  @Prop({ enum: ['success', 'failed', 'pending'], default: 'pending' }) // Status enum
  status: string;

  @Prop({ required: true }) // Payment method
  method: string;

  // createdAt aur updatedAt timestamps schema option se auto milenge
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);