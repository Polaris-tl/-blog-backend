import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async sendCode(email: string) {
    const _code = await this.cacheManager.get(email);
    if (_code) {
      throw new BadRequestException('验证码已发送, 请稍后再试（有效期·5分钟）');
    }
    const verifyCode = await this.mailService.sendVerificationCode(email);
    await this.cacheManager.set(email, verifyCode, 5 * 60 * 1000);
  }

  async signup(
    username: string,
    password: string,
    email: string,
    avatar: string,
    verifyCode: string,
  ) {
    const catchVerifyCode = await this.cacheManager.get(email);
    if (!catchVerifyCode || catchVerifyCode !== verifyCode) {
      throw new BadRequestException('验证码错误');
    }
    const user = await this.usersService.findOne(username);
    if (user) {
      throw new BadRequestException('用户已存在');
    }
    const res = await this.usersService.create({
      username,
      password,
      email: email || '',
      avatar: avatar || '',
    });

    await this.cacheManager.del(email);
    return res;
  }
}
