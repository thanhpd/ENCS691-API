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
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }): Promise<User | undefined> {
    const userByUserName = await this.usersRepository.findOne({
      where: { username: userName },
      select: ['password', 'id', 'email', 'username'],
    });

    const user = userByUserName;

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
    const userByEmail = await this.usersRepository.findOne({
      where: { email: userDto.email },
    });
    const userByUsername = await this.usersRepository.findOne({
      where: { username: userDto.username },
    });
    const userInDB = userByEmail || userByUsername;
    if (userInDB) {
      throw new HttpException(
        'An user with the same email or username has already existed',
        HttpStatus.BAD_REQUEST,
      );
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
