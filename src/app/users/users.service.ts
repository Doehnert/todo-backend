import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const existingUser = await this.findOneByEmail(email);

    if (existingUser)
      throw new BadRequestException('User with this e-mail already exists');
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: {
        todos: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  findAll() {
    return this.userRepo.find();
  }

  async update(id: string, attrs: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.userRepo.softDelete(id);
  }
}
