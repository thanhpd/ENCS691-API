import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  avatarUrl?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
