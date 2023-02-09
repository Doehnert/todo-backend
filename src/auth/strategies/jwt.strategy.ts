import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { accessSecret } from 'src/helpers/secret-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'JWT_SECRET_KEY',
        accessSecret('JWT_SECRET_KEY'),
      ),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
