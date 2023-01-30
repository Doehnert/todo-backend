import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  login(user: Partial<User>) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.findOneByEmail(email);
      if (!user) return null;
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
