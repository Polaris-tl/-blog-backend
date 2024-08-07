import { Body, Controller, Post, Get } from '@nestjs/common';
import { SkipLoginCheck } from '@/common/decorator/login';
import { AuthService } from './auth.service';
import { User } from '@/common/decorator/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipLoginCheck()
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Get('getUserInfo')
  getUserInfo(@User() user: IUser) {
    console.log(user);
    return this.authService.getUserInfo(user.id);
  }

  @SkipLoginCheck()
  @Get('sendCode')
  sendCode(@Body('email') email: string) {
    return this.authService.sendCode(email);
  }
}
