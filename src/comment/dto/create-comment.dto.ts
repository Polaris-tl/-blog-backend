import { IsString, IsOptional } from 'class-validator';
export class CreateCommentDto {
  @IsString()
  name: string;

  @IsString()
  post_id: string;

  @IsString()
  @IsOptional()
  p_id: string;

  @IsString()
  content: string;
}
