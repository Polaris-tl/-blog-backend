import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    return {
      access_token: 'fake_token',
    };
  }
}
