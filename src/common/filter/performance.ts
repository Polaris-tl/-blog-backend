import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { MailService } from '@/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(responseTime);
        console.log(this.configService.get('alert.timeoutSeconds') * 1000);
        if (
          responseTime >
          this.configService.get('alert.timeoutSeconds') * 1000
        ) {
          const text = `接口响应时间超过阈值：${context.switchToHttp().getRequest().method} ${context.switchToHttp().getRequest().url} - Response Time: ${responseTime}ms`;
          this.logger.warn(text);
          this.mailService.sendAlert(text, '响应慢');
        }
      }),
    );
  }
}
