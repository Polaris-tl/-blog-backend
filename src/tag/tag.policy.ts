import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TagGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = context.getHandler().name;
    if (['findOne', 'findAll'].includes(method)) {
      return true;
    }
    return request.user.role === '1';
  }
}
