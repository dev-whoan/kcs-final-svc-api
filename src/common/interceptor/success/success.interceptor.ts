import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Logger,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';
import { MicroserviceDataWrapper } from '../../data/microservice-data-wrapper';
import { FileInfo } from '../../../files/data/file-info.schema';

export function SuccessInterceptor(
  successCode: HttpStatus,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private logger = new Logger('SuccessInterceptor');
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToRpc();
      const rpcData = ctx.getData();
      const uploadedArray = [];

      //* get destination from multerOptions

      return next.handle().pipe(
        map((data) => {
          return this.setDataAsMicroserviceDataWrapper(data);
        }),
      );
      // ({ ...data, result: uploadedArray })));
    }

    setDataAsMicroserviceDataWrapper(fileResult): MicroserviceDataWrapper {
      const success = fileResult !== null;
      const code = success ? successCode : HttpStatus.NO_CONTENT;

      if (typeof fileResult === 'number') {
        if (fileResult >= 200 && fileResult < 400) {
          return {
            success: true,
            code: fileResult,
          };
        }
        return {
          success: false,
          code: fileResult,
        };
      }

      if (!fileResult.length) {
        fileResult = [fileResult];
      }

      const result = [];
      for (let i = 0; i < fileResult.length; i++) {
        const _file = fileResult[i];
        result.push(_file);
      }

      return {
        success,
        code,
        result,
      };
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
