import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateRandomCode } from '@/common/util';
import * as nodemailer from 'nodemailer';

// 自定义邮件服务
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'), //QQ邮箱的服务器
      port: 587, //端口号 465 | 587
      secure: false, // 465为true,其他为false
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.pass'),
      },
    });
  }

  async sendVerificationCode(email: string) {
    const message = generateRandomCode();
    const mailOptions: nodemailer.SendMailOptions = {
      from: `Polaris-blog<${this.configService.get('email.user')}>`,
      to: email,
      subject: '网站注册邮箱验证',
      html: `<b>邮箱验证码: ${message}</b>`,
    };
    await this.transporter.sendMail(mailOptions);
    return message;
  }
}
