import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { Reflector } from '@nestjs/core';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const handler = context.getHandler();
    const eventName = this.reflector.get<string>('message', handler); // 获取事件名称
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      client.emit(eventName, '请登陆后重试');
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });
      client.handshake.auth.user = payload;
    } catch {
      client.emit(eventName, 'token 失效，请重新登录');
      return false;
    }

    return true;
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
