import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PostModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234qwer',
      database: 'blog',
      entities: [],
      synchronize: true, // 生产环境请关闭此选项
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
