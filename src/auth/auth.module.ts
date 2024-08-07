import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '@/mail/mail.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
