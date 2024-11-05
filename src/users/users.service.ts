import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async comparePasswords(
    storedPassword: string,
    currentPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(currentPassword, storedPassword);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateCredentials({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.findOneByEmail(email);

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

    const user = this.usersRepository.create(userDto);
    await this.usersRepository.save(user);

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
