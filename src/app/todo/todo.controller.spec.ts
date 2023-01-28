import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/auth/roles/role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entity/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 1 }),
  new TodoEntity({ id: '4', task: 'task-4', isDone: 0 }),
  new TodoEntity({ id: '5', task: 'task-5', isDone: 1 }),
];

const newTodoEntity = new TodoEntity({
  task: 'new-task',
  isDone: 0,
});

const updatedTodoEntity = new TodoEntity({
  task: 'task-1',
  isDone: 1,
});

const body: CreateTodoDto = {
  task: 'new-task',
  isDone: 0,
};

const user: User = {
  id: '123oiu',
  email: 'user@mail.com',
  password: 'Password123$',
  birthDate: new Date(),
  createdAt: '2023-01-28 13:31:45.547603',
  roles: Role.User,
  deletedAt: null,
  updatedAt: null,
  todos: null,
  hashPassword: null,
};

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            findOne: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      // Arrange
      // Act
      const result = await todoController.index();

      // Assert
      expect(result).toEqual(todoEntityList);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      // Arrange

      // Act
      const result = await todoController.create(body, user);

      // Assert
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body, user);
    });

    it('should throw an exception if todoService throws', () => {
      // Arrange
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.create(body, user)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get a todo item successfully', async () => {
      // Act
      const result = await todoController.show('1');

      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.findOne).toHaveBeenCalledTimes(1);
      expect(todoService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoService, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };
      // Act
      const result = await todoController.update('1', body, user);

      // Assert
      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body, user);
    });

    it('should throw an exception if todoService throws', () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.update('1', body, user)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should remove a todo item successfully', async () => {
      // Act
      const result = await todoController.destroy('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.destroy('1')).rejects.toThrowError();
    });
  });
});
