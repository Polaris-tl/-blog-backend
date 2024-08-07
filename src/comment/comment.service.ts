import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { listToTree } from '@/common/util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  create(createCommentDto: CreateCommentDto, user_id: string) {
    return this.commentRepository.save({
      ...createCommentDto,
      user_id,
    });
  }

  async findAll(page = 1, pageSize = 10) {
    const post_id = '1';
    const sql = `
    WITH RECURSIVE CommentTree AS (
        -- 基础查询：获取指定post_id的根评论
        SELECT
            c.id AS comment_id,
            c.p_id AS parent_id,
            c.post_id,
            c.user_id,
            c.content,
            c.create_time,
            0 AS level,
            CAST(c.id AS CHAR(100)) AS path
        FROM
            comment c
        WHERE
            c.post_id = ? AND c.p_id IS NULL
        UNION ALL
        -- 递归查询：获取子评论
        SELECT
            c.id AS comment_id,
            c.p_id AS parent_id,
            c.post_id,
            c.user_id,
            c.content,
            c.create_time,
            ct.level + 1,
            CONCAT_WS(',', ct.path, CAST(c.id AS CHAR(100))) AS path
        FROM
            comment c
        JOIN
            CommentTree ct ON c.p_id = ct.comment_id
    )
    SELECT
        ct.comment_id,
        ct.parent_id,
        ct.post_id,
        ct.user_id,
        u.username,
        u.email,
        ct.content,
        ct.create_time,
        ct.level,
        ct.path,
        (SELECT COUNT(*) FROM comment WHERE p_id = ct.comment_id AND post_id = ?) AS child_count
    FROM
        CommentTree ct
    JOIN
        user u ON ct.user_id = u.id
    ORDER BY
        ct.level ASC, ct.create_time DESC
    LIMIT ?
    OFFSET ?;
    `;
    const offset = (page - 1) * pageSize;
    const mainRes = await this.dataSource.query(sql, [
      post_id,
      post_id,
      pageSize,
      offset,
    ]);
    return listToTree(mainRes, 'comment_id', 'parent_id', 'children');
  }

  /**
   * 我有一张评论表comment(p_id, post_id, user_id, content, create_time)
   * 一张用户表user(id, username, email)
   * 一张文章表post(id, title)
   * 需要一个查询语句，根据post_id分页查询评论及其子评论(无限嵌套，需要递归查询，需要查询出子评论的总数),同时需要查询根评论的总数，子评论的初始长度为5
   */

  findOne(id: number) {
    return this.commentRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number) {
    this.commentRepository.delete(id);
  }
  async reply(id: string, content: string, user_id: string) {
    const res = await this.commentRepository.findOne({
      where: { id: +id },
    });
    if (res) {
      return this.commentRepository.save({
        content,
        post_id: res.post_id,
        user_id,
        p_id: id,
      });
    } else {
      throw new BadRequestException('回复的评论不存在');
    }
  }
}
