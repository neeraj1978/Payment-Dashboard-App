import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema, User } from './schemas/user.schema'; // UserSchema import karo
import { JwtStrategy } from './jwt.strategy'; // Abhi banayenge

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // User schema register kiya
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // !!! production mein environment variable use karna
      signOptions: { expiresIn: '60m' }, // Token expiry time [cite: 39]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy provide karna zaroori hai
  exports: [AuthService], // Agar dusre modules mein AuthService use karna hai
})
export class AuthModule {}