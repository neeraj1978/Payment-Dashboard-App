import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Yeh import karo
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
// Baaki modules jo banayenge, unko bhi yahan import karenge

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/payment_dashboard'),
    AuthModule,
    PaymentsModule,
    UsersModule, 
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}