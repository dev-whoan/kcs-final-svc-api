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
import { UserMicroserviceDto } from '../../../user/data/dto/user.dto';

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

    setDataAsMicroserviceDataWrapper(userResult): MicroserviceDataWrapper {
      const success = userResult !== null;
      const code = success ? HttpStatus.CREATED : HttpStatus.NO_CONTENT;

      if (typeof userResult === 'number') {
        return {
          success: false,
          code: userResult,
        };
      }

      const userMsData = new UserMicroserviceDto(userResult);

      const result = [userMsData];
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
