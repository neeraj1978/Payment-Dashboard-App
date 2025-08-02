import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard'; // Abhi banayenge
import { Roles } from '../common/decorators/roles.decorator'; // Abhi banayenge
import { UserRole } from '../common/enums/user-role.enum'; // Abhi banayenge

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // AuthGuard aur RolesGuard lagaya
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get() // GET /users [cite: 46]
  @Roles(UserRole.Admin) // Sirf admin hi users list dekh sakta hai
  async getUsers() {
    return this.usersService.findAllUsers();
  }

  @Post() // POST /users [cite: 47]
  @Roles(UserRole.Admin) // Sirf admin hi naye user bana sakta hai
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}