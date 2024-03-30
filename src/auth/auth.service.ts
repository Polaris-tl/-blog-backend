import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload: IUser = {
      username: user.username,
      id: user.id + '',
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      token: access_token,
      user: payload,
    };
  }

  async getUserInfo(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw '用户不存在';
    }
    return user;
  }
}
