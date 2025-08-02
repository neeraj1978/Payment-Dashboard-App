import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // LoginDto import kiya [cite: 14]

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // POST /auth/login endpoint [cite: 14, 37]
  @HttpCode(HttpStatus.OK) // Success par 200 OK return karega
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}