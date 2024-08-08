import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { MailService } from '@/mail/mail.service';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly mailService: MailService,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      const status = exception.getStatus();
      return response.status(status).json({
        code: status,
        success: false,
        msg: '无权限访问',
      });
    }
    const errorMsg = (exception as Error)?.message;
    const req = ctx.getRequest();
    this.logger.error(`${req.method} ${req.url}`);
    this.logger.error(exception);
    this.mailService.sendAlert(String(exception), '服务器异常');
    return response.status(500).json({
      code: 500,
      success: false,
      msg: errorMsg || 'Internal Server Error',
    });
  }
}
