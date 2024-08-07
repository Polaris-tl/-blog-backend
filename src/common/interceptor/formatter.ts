import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function toCamelCase(str: string) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}

// 转成驼峰格式的数据
function transformObjectDeep(obj: any) {
  if (typeof obj !== 'object' || obj === null || obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectDeep(item));
  }
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[toCamelCase(key)] = transformObjectDeep(obj[key]);
    }
  }
  return result;
}

export interface Response<T> {
  result: T;
}

@Injectable()
export class FormatterInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const res = {
          code: 200,
          success: true,
          result: transformObjectDeep(data),
          msg: '请求成功',
        };
        this.logger.log(res);
        return res;
      }),
    );
  }
}
