import { Injectable } from '@nestjs/common';
import { User } from 'src/app/users/entity/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    console.log(
      '🚀 ~ file: auth.service.ts:15 ~ AuthService ~ login ~ user',
      user,
    );
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.findOneByEmail(email);
      console.log(
        '🚀 ~ file: auth.service.ts:34 ~ AuthService ~ validateUser ~ user',
        user,
      );
      if (!user) return null;
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
