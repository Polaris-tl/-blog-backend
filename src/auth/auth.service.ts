import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
    return this.mailService.sendVerificationCode(email);
  }

  async signup(
    username: string,
    password: string,
    email: string,
    avatar: string,
    verifyCode: string,
  ) {
    console.log(username, password, verifyCode);
    // 从redis中获取验证码
    // const code = await redis.get(email);
    // if (code !== verifyCode) {
    //   throw '验证码错误';
    // }
    const user = await this.usersService.findOne(username);
    if (user) {
      throw '用户已存在';
    }
    return await this.usersService.create({
      username,
      password,
      email: email || '',
      avatar: avatar || '',
    });
  }
}
