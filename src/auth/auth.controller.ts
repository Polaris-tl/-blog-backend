import { Body, Controller, Post } from '@nestjs/common';
import { SkipLoginCheck } from '@/common/decorator/login';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipLoginCheck()
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
