import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from '@/common/gurad/login';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { MailService } from './mail/mail.service';
import { EventGateway } from './events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message }) => {
              const appStr = `[NEST]`;
              const contextStr = `[${context}]`;
              return `${appStr} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          level: 'error',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          level: 'info',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),
      ],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secretKey'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    PostModule,
    UserModule,
    TagModule,
    CategoryModule,
    CommentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
    {
      provide: 'MAIL_SERVICE',
      useClass: MailService,
    },
    {
      provide: 'CONFIG_SERVICE',
      useClass: ConfigService,
    },
    EventGateway,
  ],
})
export class AppModule {}
