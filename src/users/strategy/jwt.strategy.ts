// src/users/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { User } from '../entities/user.entity/user.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: User): Promise<User> {
    if (!payload.id) throw new UnauthorizedException('Invalid credentials');
    const existingUser = await this.usersService.findOneById(payload.id);

    if (!existingUser) throw new UnauthorizedException('Invalid credentials');
    delete existingUser.password;
    return existingUser;
  }
}
