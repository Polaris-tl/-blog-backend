import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { pickFields } from '@/common/util';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(
      pickFields(createUserDto, ['username', 'password', 'email', 'avatar']),
    );
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username, deleted_at: null },
      select: ['id', 'username', 'password', 'email', 'avatar'],
    });
  }
  async findById(id: string) {
    return await this.userRepository.findOne({
      where: { id: +id, deleted_at: null },
      select: ['id', 'username', 'password', 'email', 'avatar'],
    });
  }

  async update(id: number, updateUserDto: CreateUserDto) {
    await this.userRepository.update(
      { id },
      pickFields(updateUserDto, ['username', 'password', 'email', 'avatar']),
    );
    return true;
  }

  async remove(id: number) {
    await this.userRepository.update({ id }, { deleted_at: new Date() });
    return true;
  }
}
