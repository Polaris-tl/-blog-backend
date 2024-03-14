import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@/common/filter/exception';
import { FormatterInterceptor } from '@/common/interceptor/formatter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new FormatterInterceptor());
  await app.listen(3000);
}
bootstrap();
