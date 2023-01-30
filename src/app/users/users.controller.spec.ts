import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/auth/roles/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const userEntityList: User[] = [
  new User({
    id: 'user_id1',
    email: 'user1@mail.com',
    password: 'hashed_password',
    roles: Role.User,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }),
  new User({
    id: 'user_id2',
    email: 'user2@mail.com',
    password: 'hashed_password',
    roles: Role.User,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }),
  new User({
    id: 'user_id3',
    email: 'user3@mail.com',
    password: 'hashed_password',
    roles: Role.User,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }),
  new User({
    id: 'user_id4',
    email: 'user4@mail.com',
    password: 'hashed_password',
    roles: Role.User,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }),
];

const createUserBody: CreateUserDto = {
  email: 'new_user@mail.com',
  password: 'V4lidPass123!',
};

const newUserEntity = new User({
  id: 'new_user_id',
  email: 'new_user@mail.com',
  password: 'new_hashed_password',
});

const updatedUserEntity = new User({
  id: 'updated_user_id',
  email: 'updated_user@mail.com',
  password: 'updated_hashed_password',
});

describe('UsersController', () => {
  let usersController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userEntityList),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            findOneByEmail: jest.fn().mockResolvedValue(userEntityList[0]),
            create: jest.fn().mockResolvedValue(newUserEntity),
            update: jest.fn().mockResolvedValue(updatedUserEntity),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return a users list entity successfully', async () => {
      // Act
      const result = await usersController.findAllUsers();

      // Assert
      expect(result).toEqual(userEntityList);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if userService throws', () => {
      // Arrange
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersController.findAllUsers()).rejects.toThrowError();
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Act
      const result = await usersController.createUser(createUserBody);

      // Assert
      expect(result).toEqual(newUserEntity);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(
        createUserBody.email,
        createUserBody.password,
      );
    });

    it('should throw an BadRequestException if invalid email', async () => {
      // Arrange
      const userInvalidEmail: CreateUserDto = {
        email: 'new_user',
        password: 'V4lidPass123!',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new BadRequestException());

      // Assert
      expect(usersController.createUser(userInvalidEmail)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw an BadRequestException if invalid password', async () => {
      // Arrange
      const userInvalidPassword: CreateUserDto = {
        email: 'new_user@mail.com',
        password: '123',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new BadRequestException());

      // Assert
      expect(
        usersController.createUser(userInvalidPassword),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw an exception if userService throws', () => {
      // Arrange
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersController.createUser(createUserBody)).rejects.toThrowError();
    });
  });

  describe('findUser', () => {
    it('should get a user successfully', async () => {
      // Act
      const result = await usersController.findUser('user_id1');

      // Assert
      expect(result).toEqual(userEntityList[0]);
    });

    it('should throw a not found exception', async () => {
      // Arrange
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(usersController.findUser('user2@mail.com')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw if userService throws', () => {
      // Arrange
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersController.findUser('user_id1')).rejects.toThrowError();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user successfully', async () => {
      // Act
      const result = await usersController.findOneByEmail('user1@mail.com');

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledWith('user1@mail.com');
    });

    it('throws if userService throws', () => {
      // Arrange
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(
        usersController.findOneByEmail('user1@mail.com'),
      ).rejects.toThrowError();
    });

    it('should throw a not found exception', async () => {
      // Arrange
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        usersController.findOneByEmail('user2@mail.com'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('removeUser', () => {
    it('should remove a user successfully', async () => {
      // Act
      const result = await usersController.removeUser('user_id1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception if userService throws', () => {
      // Arrange
      jest.spyOn(userService, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersController.removeUser('user_id1')).rejects.toThrowError();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const body: UpdateUserDto = {
        email: 'updated_user@mail.com',
        password: 'updated_hashed_password',
      };

      // Act
      const result = await usersController.updateUser('user_id1', body);

      // Assert
      expect(result).toEqual(updatedUserEntity);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith('user_id1', body);
    });

    it('should throw if userService throws', () => {
      // Arrange
      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());
      const body: UpdateUserDto = {
        email: 'updated_user@mail.com',
        password: 'valid_password',
      };

      // Assert
      expect(
        usersController.updateUser('user_id1', body),
      ).rejects.toThrowError();
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      jest
        .spyOn(userService, 'update')
        .mockRejectedValueOnce(new NotFoundException());
      const body: UpdateUserDto = {
        email: 'updated_user@mail.com',
        password: 'valid_password',
      };

      // Assert
      expect(usersController.updateUser('user_id1', body)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if updated email is invalid', async () => {
      // Arrange
      jest
        .spyOn(userService, 'update')
        .mockRejectedValueOnce(new BadRequestException());
      const invalidEmailBody: UpdateUserDto = {
        email: 'updated_user',
        password: 'valid_password',
      };

      // Assert
      expect(
        usersController.updateUser('user_id1', invalidEmailBody),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if updated password is invalid', async () => {
      // Arrange
      jest
        .spyOn(userService, 'update')
        .mockRejectedValueOnce(new BadRequestException());
      const invalidPasswordBody: UpdateUserDto = {
        email: 'updated_user@mail.com',
        password: 'invalid_password',
      };

      // Assert
      expect(
        usersController.updateUser('user_id1', invalidPasswordBody),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
