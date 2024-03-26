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

    if (!this[method]) return true;
    return await this[method](request);
  }

  async create(request) {
    const { user } = request;
    console.log(user);

    return user.role === '1';
  }

  async findOne(request) {
    const { user, params } = request;
    const res = await this.userRepository.findOne({
      where: { username: params.username },
    });
    return res.id === user.id;
  }
}
