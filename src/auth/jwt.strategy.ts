import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT Bearer token se extract hoga
      ignoreExpiration: false, // Token expiry check hogi
      secretOrKey: 'YOUR_SECRET_KEY', // Wahi secret key jo JwtModule mein hai
    });
  }

  async validate(payload: any) {
    // Payload mein woh data hoga jo token mein dala tha (e.g., userId, username, role)
    // Yahan tum database se user ko fetch kar sakte ho additional validation ke liye
    const user = { userId: payload.sub, username: payload.username, role: payload.role };
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}