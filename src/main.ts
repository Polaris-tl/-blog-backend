import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@/common/filter/exception';
import { FormatterInterceptor } from '@/common/interceptor/formatter';
import { ValidatePipe } from '@/common/pipe/validate';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidatePipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new FormatterInterceptor());
  await app.listen(3000);
}
bootstrap();
