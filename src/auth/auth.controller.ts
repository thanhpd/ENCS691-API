import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('register')
  async register(
    @Body() registerDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.authService.register({
      ...registerDto,
      avatar,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    req.logout();
  }
}
