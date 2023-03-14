import {
  CallHandler,
  ExecutionContext,
  Logger,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
export function MicroserviceDataLogger(
  className: string,
): Type<NestInterceptor> {
  class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger(className);

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToRpc();

      return next
        .handle()
        .pipe(
          tap((data) => this.logger.log(`Returning`, JSON.stringify(data))),
        );
    }
  }
  const Interceptor = mixin(LoggingInterceptor);
  return Interceptor;
}
