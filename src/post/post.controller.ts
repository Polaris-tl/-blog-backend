import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@/common/decorator/user';
import { SkipLoginCheck } from '@/common/decorator/login';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postService.create(createPostDto, user.id);
  }

  @SkipLoginCheck()
  @Get('list')
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @User() user: IUser,
  ) {
    return this.postService.findAll(user?.id, +page, +pageSize);
  }

  @SkipLoginCheck()
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.postService.findOne(+id, user?.id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Post('publish/:id')
  publish(@Param('id') id: string, @Body('publish') publish: boolean) {
    return this.postService.publish(+id, publish);
  }

  @Post('like/:id')
  like(
    @Param('id') id: string,
    @Body('like') like: boolean,
    @User() user: IUser,
  ) {
    console.log(like, 'asdasd');
    return this.postService.like(id, like, user.id);
  }

  @Post('collect/:id')
  collect(
    @Param('id') id: string,
    @Body('collect') collect: boolean,
    @User() user: IUser,
  ) {
    return this.postService.collect(id, collect, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
