import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/app/users/entity/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { AuthService } from './auth.service';
import { Role } from './roles/role.enum';
import * as bcrypt from 'bcrypt';

const userEntity = new User({
  id: 'user_id1',
  email: 'user1@mail.com',
  password: 'valid_password',
  roles: Role.User,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});

const receivedToken = 'new_token';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(userEntity),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(receivedToken),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if correct login data', () => {
      // Arrange
      const user: Partial<User> = {
        id: 'user_id',
        email: 'user@mail.com',
        roles: Role.User,
      };

      // Act
      const result = authService.login(user);

      // Assert
      expect(result).toEqual({ token: receivedToken });
    });
  });

  describe('validateUser', () => {
    it('should return a user if the given password is equal to the password of the user with the given email', async () => {
      // Arrange
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      // Act
      const result = await authService.validateUser(
        'user1@mail.com',
        'valid_password',
      );

      // Assert
      expect(result).toEqual(userEntity);
    });

    it('should return null if the given email dont belong to any user', async () => {
      // Arrange
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);

      // Act
      const result = await authService.validateUser(
        'user1@mail.com',
        'valid_password',
      );

      // Assert
      expect(result).toBe(null);
    });

    it('should return null if the password provided is not the same as the user with the given email', async () => {
      // Arrange
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

      // Act
      const result = await authService.validateUser(
        'user1@mail.com',
        'valid_password',
      );

      // Assert
      expect(result).toBe(null);
    });
  });
});
