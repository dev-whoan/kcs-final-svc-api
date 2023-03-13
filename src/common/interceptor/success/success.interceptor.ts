import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';
import { MicroserviceDataWrapper } from '../../data/microservice-data-wrapper';
import { FileInfoMicroserviceDto } from '../../../files/data/dto/file-info.ms.dto';

export function SuccessInterceptor(): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
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
      const code = success ? HttpStatus.CREATED : HttpStatus.NO_CONTENT;

      if (typeof fileResult === 'number') {
        return {
          success: false,
          code: fileResult,
        };
      }

      const fileMsData = new FileInfoMicroserviceDto(fileResult);

      const result = [fileMsData];
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
