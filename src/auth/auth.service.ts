import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenContent } from 'src/auth/token-content.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return this.usersService.validateCredentials({ email, password });
  }

  async login(user: User) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: ITokenContent = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: CreateUserDto) {
    const user = await this.usersService.create(userDto);
    if (!user) {
      throw new InternalServerErrorException();
    }

    return user;
  }
}
