import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from '@/common/gurad/login';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234qwer',
      database: 'blog',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true, // 生产环境请关闭此选项
    }),
    AuthModule,
    PostModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}
