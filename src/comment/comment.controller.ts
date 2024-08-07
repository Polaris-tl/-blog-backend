import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentGuard } from './comment.policy';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@/common/decorator/user';

@UseGuards(CommentGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentService.create(createCommentDto, user?.id);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.commentService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateCommentDto) {
    this.commentService.update(+id, {
      content: updateTagDto.content,
    });
  }

  @Post('reply/:id')
  reply(
    @Param('id') pId: string,
    @Body('content') content: string,
    @User() user: IUser,
  ) {
    return this.commentService.reply(pId, content, user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.commentService.remove(+id);
  }
}
