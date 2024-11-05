import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { userId } = req.user;
    const user: User = await this.usersService.findOne(userId);
    delete user.password;

    return user;
  }
}
