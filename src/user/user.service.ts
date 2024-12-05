import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MediaService } from 'src/common/media/media.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  private async comparePasswords(
    storedPassword: string,
    currentPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(currentPassword, storedPassword);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateCredentials({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['password', 'id', 'email'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const userInDB = await this.findOneByEmail(userDto.email);
    if (userInDB) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    let user = this.usersRepository.create({
      ...userDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (userDto.avatar) {
      const avatarUrl = await this.mediaService.uploadFile(
        userDto.avatar,
        'users',
      );
      user.avatarUrl = avatarUrl;
    }

    user = await this.usersRepository.save(user);
    delete user.password;

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}
