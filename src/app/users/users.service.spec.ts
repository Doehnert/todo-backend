import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/role.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
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

const updatedUserEntity = new User({
  id: 'updated_user_id',
  email: 'updated_user@mail.com',
  password: 'updated_hashed_password',
  roles: Role.User,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});

describe('UsersService', () => {
  let userService: UsersService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(userEntityList[0]),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            find: jest.fn().mockResolvedValue(userEntityList),
            save: jest.fn().mockResolvedValue(userEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user entity successfully', async () => {
      // Arrange
      const data: CreateUserDto = {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);

      // Act
      const result = await userService.create(data.email, data.password);

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if e-mail already exists', () => {
      // Arrange
      const data: CreateUserDto = {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };

      // Assert
      expect(
        userService.create(data.email, data.password),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if e-mail is invalid', () => {
      // Arrange
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(userRepo, 'save')
        .mockRejectedValueOnce(new BadRequestException());

      const data: CreateUserDto = {
        email: 'invalid_email',
        password: 'valid_password',
      };

      // Assert
      expect(
        userService.create(data.email, data.password),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if password is invalid', () => {
      // Arrange
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(userRepo, 'save')
        .mockRejectedValueOnce(new BadRequestException());

      const data: CreateUserDto = {
        email: 'valid_email@mail.com',
        password: 'invalid_password',
      };

      // Assert
      expect(
        userService.create(data.email, data.password),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw if userService throws', () => {
      // Arrange
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepo, 'save').mockRejectedValueOnce(new Error());

      const data: CreateUserDto = {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };

      // Assert
      expect(
        userService.create(data.email, data.password),
      ).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a user entity successfully', async () => {
      // Act
      const result = await userService.findOne('user_id1');

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if user not fond', () => {
      // Arrange
      jest
        .spyOn(userRepo, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(userService.findOne('user_id1')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw if userRepo throws', () => {
      // Arrange
      jest.spyOn(userRepo, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.findOne('user_id1')).rejects.toThrowError(Error);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user entity successfully', async () => {
      // Act
      const result = await userService.findOneByEmail('user1@mail.com');

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return NotFoundException if user not found', () => {
      // Arrange
      jest
        .spyOn(userRepo, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(userService.findOneByEmail('user1@mail.com')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return throw if userRepo throws', () => {
      // Arrange
      jest.spyOn(userRepo, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.findOneByEmail('user1@mail.com')).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('findAll', () => {
    it('should return a user entity list successfully', async () => {
      // Act
      const result = await userService.findAll();

      // Assert
      expect(result).toEqual(userEntityList);
      expect(userRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userRepo, 'find').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.findAll()).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a user entity successfully', async () => {
      // Arrange
      const data: UpdateUserDto = {
        email: 'updated_email@mail.com',
        password: 'updated_password',
      };

      jest.spyOn(userRepo, 'save').mockResolvedValueOnce(updatedUserEntity);

      // Act
      const result = await userService.update('user_id1', data);

      // Assert
      expect(result).toEqual(updatedUserEntity);
    });

    it('should throw a NotFoundException', () => {
      // Arrange
      jest
        .spyOn(userRepo, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      const data: UpdateUserDto = {
        email: 'updated_email@mail.com',
        password: 'updated_password',
      };

      // Assert
      expect(userService.update('user_id1', data)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a exception', () => {
      // Arrange
      jest.spyOn(userRepo, 'save').mockRejectedValueOnce(new Error());

      const data: UpdateUserDto = {
        email: 'updated_email@mail.com',
        password: 'updated_password',
      };

      // Assert
      expect(userService.update('user_id1', data)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should delete a user entity successfully', async () => {
      // Act
      const result = await userService.remove('user_id1');

      // Assert
      expect(result).toBeUndefined();
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      // Arrange
      jest
        .spyOn(userRepo, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(userService.remove('user_id1')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a exception', () => {
      // Arrange
      jest.spyOn(userRepo, 'softDelete').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.remove('user_id1')).rejects.toThrowError();
    });
  });
});
