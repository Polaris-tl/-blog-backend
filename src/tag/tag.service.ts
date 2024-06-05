import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  async findAll(page = 1, pageSize = 10) {
    const data = await this.tagRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM tag
    `);
    return {
      ...total[0],
      data: data,
      page,
      pageSize,
    };
  }

  findOne(id: number) {
    return this.tagRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update(id, updateTagDto);
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
