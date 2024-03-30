import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const method = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    // 管理员放行所有操作
    if (request.user.role === '1') return true;

    if (!this[method]) return true;
    return await this[method](request);
  }

  async update(request) {
    const { user, params } = request;
    return user.id === params.id;
  }
  async remove() {
    return false;
  }
}
