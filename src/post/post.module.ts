import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/post-like.entity';
import { PostCollectEntity } from './entities/post-collect.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, PostLikeEntity, PostCollectEntity]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
