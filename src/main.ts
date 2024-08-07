import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@/common/filter/exception';
import { FormatterInterceptor } from '@/common/interceptor/formatter';
import { ValidatePipe } from '@/common/pipe/validate';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config({ path: ['.env.local', '.env.development'] });
} else if (process.env.NODE_ENV === 'production') {
  config({ path: '.env.production' });
} else {
  config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidatePipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new FormatterInterceptor(logger));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
}
bootstrap();
