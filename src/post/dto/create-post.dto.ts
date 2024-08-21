import { IsString, IsOptional, IsBoolean } from 'class-validator';
export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  tagIds: number[];

  categoryIds: number[];

  @IsString()
  @IsOptional()
  cover: string;

  @IsBoolean()
  @IsOptional()
  is_top: boolean;

  @IsBoolean()
  @IsOptional()
  publish: boolean;
}
