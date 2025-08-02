import { IsString, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Minimum password length
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'viewer']) // Roles define kiye [cite: 52]
  role: string;
}