import { IsString, IsOptional } from 'class-validator';
export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  cover: string;

  @IsString()
  @IsOptional()
  publish: boolean;
}
