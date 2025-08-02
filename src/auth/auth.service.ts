import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // ========================================================================
  // DEBUGGING के लिए TEMPORARY METHOD
  // यह method सीधे username और password को compare करता है, hashing का उपयोग नहीं करता।
  // जब login काम करना शुरू कर दे, तो इस method को हटाकर original validateUser का उपयोग करें।
  // ========================================================================
  async validateUser(username: string, pass: string): Promise<any> {
    // Hardcoded admin user credentials
    const hardcodedAdmin = { username: 'admin', password: 'admin123', role: 'admin', _id: '123' };

    if (username === hardcodedAdmin.username && pass === hardcodedAdmin.password) {
      // अगर credentials match होते हैं, तो user object return करें
      const { password, ...result } = hardcodedAdmin;
      return result;
    }
    
    // अगर hardcoded credentials match नहीं होते हैं, तो database में देखें
    const user = await this.userModel.findOne({ username }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }
  
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async createAdminUser() {
    const adminExists = await this.userModel.findOne({ username: 'admin' }).exec();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      console.log('Admin user created!');
    }
  }
}
