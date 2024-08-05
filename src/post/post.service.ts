import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/post-like.entity';
import { PostCollectEntity } from './entities/post-collect.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { pickFields } from '@/common/util';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
    @InjectRepository(PostCollectEntity)
    private readonly postCollectRepository: Repository<PostCollectEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    return await this.postRepository.save({
      ...pickFields(createPostDto, ['title', 'content', 'cover', 'publish']),
      author: userId,
    });
  }

  // 只查询数据库一次 但是需要手动聚合一些数据
  async findAll(userId: string = '-1', page = 1, pageSize = 10) {
    const mainQuery = `
        SELECT DISTINCT
            post.*,
            (SELECT COUNT(*) FROM post_like WHERE post_id = post.id) as like_count,
            (SELECT COUNT(*) FROM post_collect WHERE post_id = post.id) as collect_count,
            (SELECT COUNT(*) FROM comment WHERE post_id = post.id) as comment_count,
            IF(COUNT(post_like.user_id) > 0, TRUE, FALSE) as is_like,
            IF(COUNT(post_collect.user_id) > 0, TRUE, FALSE) as is_collect,
            GROUP_CONCAT(DISTINCT tag.name) as tag_names_str,
            GROUP_CONCAT(DISTINCT tag.id) as tag_ids_str,
            GROUP_CONCAT(DISTINCT category.name) as category_names_str,
            GROUP_CONCAT(DISTINCT category.id) as category_ids_str
        FROM post
        LEFT JOIN post_like ON post.id = post_like.post_id AND post_like.user_id = ?
        LEFT JOIN post_collect ON post.id = post_collect.post_id AND post_collect.user_id = ?
        LEFT JOIN post_tag ON post.id = post_tag.post_id
        LEFT JOIN tag ON post_tag.tag_id = tag.id
        LEFT JOIN post_category ON post.id = post_category.post_id
        LEFT JOIN category ON post_category.category_id = category.id
        WHERE post.delete_at IS NULL
        GROUP BY post.id
        ORDER BY post.create_time DESC
        LIMIT ?
        OFFSET ?
    `;

    const total = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM post
        WHERE post.delete_at IS NULL
    `);

    const offset = (page - 1) * pageSize;
    const mainRes = await this.dataSource.query(mainQuery, [
      userId,
      userId,
      pageSize,
      offset,
    ]);

    mainRes.forEach((item) => {
      const {
        tag_names_str,
        tag_ids_str,
        category_names_str,
        category_ids_str,
      } = item;
      const tag_names = tag_names_str?.split(',') || [];
      const tag_ids = tag_ids_str?.split(',') || [];
      const category_names = category_names_str?.split(',') || [];
      const category_ids = category_ids_str?.split(',') || [];
      item.tags = tag_names.map((name, index) => {
        return {
          id: tag_ids[index],
          name,
        };
      });
      item.categories = category_names.map((name, index) => {
        return {
          id: category_ids[index],
          name,
        };
      });
      delete item.tag_names_str;
      delete item.tag_ids_str;
      delete item.category_names_str;
      delete item.category_ids_str;
      item.like_count = +item.like_count;
      item.collect_count = +item.collect_count;
      item.comment_count = +item.comment_count;
      item.is_like = item.is_like === '1';
      item.is_collect = item.is_collect === '1';
    });

    return {
      ...total[0],
      data: mainRes,
      page,
      pageSize,
    };
  }
  //   async findAll(userId = 1, page = 1, pageSize = 10) {
  //     const offset = (page - 1) * pageSize;
  //     const posts = await this.dataSource.query(
  //       `
  //             SELECT DISTINCT
  //                 posts.*,
  //                 (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id) as like_count,
  //                 (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count,
  //                 user_favorite.user_id IS NOT NULL as is_favorite
  //             FROM posts
  //             LEFT JOIN user_favorite ON posts.id = user_favorite.post_id AND user_favorite.user_id = ?
  //             WHERE posts.delete_at IS NULL
  //             ORDER BY posts.create_time DESC
  //             LIMIT ?
  //             OFFSET ?
  //         `,
  //       [userId, pageSize, offset],
  //     );

  //     const tagsQuery = `
  //             SELECT post_tag.id, tags.*
  //             FROM post_tag
  //             LEFT JOIN tags ON post_tag.tag_id = tags.id
  //             WHERE post_tag.post_id = ?;
  //         `;

  //     const categoriesQuery = `
  //             SELECT post_category.id, categories.*
  //             FROM post_category
  //             LEFT JOIN categories ON post_category.category_id = categories.id
  //             WHERE post_category.post_id = ?;
  //         `;

  //     const promiseRes = await Promise.all(
  //       res.map((item) => {
  //         return Promise.all([
  //           this.dataSource.query(tagsQuery, [item.id]),
  //           this.dataSource.query(categoriesQuery, [item.id]),
  //         ]);
  //       }),
  //     );

  //     posts.forEach((item, index) => {
  //       item.tags = promiseRes[index][0];
  //       item.categories = promiseRes[index][1];
  //       item.like_count = +item.like_count;
  //       item.comment_count = +item.comment_count;
  //       item.is_favorite = item.is_favorite === 1;
  //     });

  //     return posts;
  //   }

  async findOne(postId: number, userId = '-1') {
    const mainQuery = `
        SELECT DISTINCT
            post.*,
            (SELECT COUNT(*) FROM post_like WHERE post_id = post.id) as like_count,
            (SELECT COUNT(*) FROM post_collect WHERE post_id = post.id) as collect_count,
            (SELECT COUNT(*) FROM comment WHERE post_id = post.id) as comment_count,
            IF(COUNT(post_like.user_id) > 0, TRUE, FALSE) as is_like,
            IF(COUNT(post_collect.user_id) > 0, TRUE, FALSE) as is_collect,
            GROUP_CONCAT(DISTINCT tag.name) as tag_names_str,
            GROUP_CONCAT(DISTINCT tag.id) as tag_ids_str,
            GROUP_CONCAT(DISTINCT category.name) as category_names_str,
            GROUP_CONCAT(DISTINCT category.id) as category_ids_str
        FROM post
        LEFT JOIN post_like ON post.id = post_like.post_id AND post_like.user_id = ?
        LEFT JOIN post_collect ON post.id = post_collect.post_id AND post_collect.user_id = ?
        LEFT JOIN post_tag ON post.id = post_tag.post_id
        LEFT JOIN tag ON post_tag.tag_id = tag.id
        LEFT JOIN post_category ON post.id = post_category.post_id
        LEFT JOIN category ON post_category.category_id = category.id
        WHERE post.delete_at IS NULL AND post.id = ?
        GROUP BY post.id
        ORDER BY post.create_time DESC
        LIMIT 1
    `;

    const mainRes = await this.dataSource.query(mainQuery, [
      userId,
      userId,
      postId,
    ]);

    mainRes.forEach((item) => {
      const {
        tag_names_str,
        tag_ids_str,
        category_names_str,
        category_ids_str,
      } = item;
      const tag_names = tag_names_str?.split(',') || [];
      const tag_ids = tag_ids_str?.split(',') || [];
      const category_names = category_names_str?.split(',') || [];
      const category_ids = category_ids_str?.split(',') || [];
      item.tags = tag_names.map((name, index) => {
        return {
          id: tag_ids[index],
          name,
        };
      });
      item.categories = category_names.map((name, index) => {
        return {
          id: category_ids[index],
          name,
        };
      });
      delete item.tag_names_str;
      delete item.tag_ids_str;
      delete item.category_names_str;
      delete item.category_ids_str;
      item.like_count = +item.like_count;
      item.collect_count = +item.collect_count;
      item.comment_count = +item.comment_count;
      item.is_like = item.is_like === '1';
      item.is_collect = item.is_collect === '1';
    });

    return mainRes[0] || null;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(
      { id },
      {
        ...pickFields(updatePostDto, ['title', 'content', 'cover', 'publish']),
        update_time: new Date(),
      },
    );
  }

  publish(id: number, publish = true) {
    this.postRepository.update({ id }, { publish, update_time: new Date() });
  }

  async like(id: string, like = true, userId) {
    const res = await this.postLikeRepository.findOne({
      where: { post_id: +id, user_id: userId },
    });
    if (res) {
      !like &&
        this.postLikeRepository.delete({ user_id: +userId, post_id: +id });
    } else {
      like &&
        this.postLikeRepository.save({
          post_id: +id,
          user_id: userId,
          like,
        });
    }
  }

  async collect(id: string, favorite = true, userId) {
    const res = await this.postCollectRepository.findOne({
      where: { post_id: +id, user_id: userId },
    });
    if (res) {
      !favorite &&
        this.postCollectRepository.delete({
          user_id: +userId,
          post_id: +id,
        });
    } else {
      favorite &&
        this.postCollectRepository.save({
          post_id: +id,
          user_id: userId,
          favorite,
        });
    }
  }

  remove(id: number) {
    this.postRepository.update({ id }, { delete_at: new Date() });
  }
}
