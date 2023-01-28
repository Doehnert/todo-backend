import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entity/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/entity/user.entity';
import { Role } from 'src/auth/roles/role.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return await this.todoRepository.find({
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.todoRepository.findOneOrFail({
        relations: {
          user: true,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(todoDto: CreateTodoDto, user: User) {
    const todo = this.todoRepository.create(todoDto);
    todo.user = user;
    return await this.todoRepository.save(todo);
  }

  async update(id: string, attrs: UpdateTodoDto, user: User) {
    const todo = await this.findOne(id);

    if (user.roles === Role.User) {
      if (todo.user.id !== user.id)
        throw new UnauthorizedException(
          'You cannot modify a todo that you do not own',
        );
    }

    Object.assign(todo, attrs);
    return await this.todoRepository.save(todo);
  }

  async deleteById(id: string) {
    await this.findOne(id);

    await this.todoRepository.softDelete(id);
  }
}
