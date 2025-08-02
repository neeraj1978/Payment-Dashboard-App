import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service'; // Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const authService = app.get(AuthService);
  await authService.createAdminUser(); 
  
  app.enableCors({
    origin: 'http://10.140.20.8:8081', // Ya tumhare frontend ka URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
});
  await app.listen(3000); // Backend 3000 port par run hoga
}
bootstrap();