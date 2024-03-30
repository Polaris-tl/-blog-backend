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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postService.create(createPostDto, user.id);
  }

  @Get('list')
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @User() user: IUser,
  ) {
    return this.postService.findAll(user.id, +page, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.postService.findOne(+id, user.id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Post('publish/:id')
  publish(@Param('id') id: string, @Body('publish') publish: boolean) {
    return this.postService.publish(+id, publish);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
