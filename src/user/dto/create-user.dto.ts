import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  avatar?: Express.Multer.File;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
