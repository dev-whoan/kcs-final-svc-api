import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcFilesInterceptor } from '../common/interceptor/file-payload-interceptor/rpc-files.interceptor';
import { MicroserviceDataLogger } from '../common/interceptor/logger/logger.interceptor';
import { multerOptions } from '../common/interceptor/file-payload-interceptor/multer/multer.options';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { FileInfoMicroserviceDto } from './data/dto/file-info.ms.dto';
import { FileServerService } from './file-server.service';

@Controller('files')
@UseInterceptors(MicroserviceDataLogger('FileServerController'))
export class FileServerController {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FileServerService) {}

  @Get()
  getFileInfoHttp() {
    return this.fileService.getFileInfo('6405a8ef83fed38c5f2ad9b8');
  }

  @MessagePattern({ cmd: 'read_file' })
  async getFileInfo(
    @Payload() data: FileInfoMicroserviceDto,
  ): Promise<MicroserviceDataWrapper> {
    const fileInfoResult = await this.fileService.getFileInfo(`${data.id}`);
    const success = fileInfoResult !== null;
    const code = success ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
    const result = [fileInfoResult];

    return {
      success,
      code,
      result,
    };
  }

  @MessagePattern({ cmd: 'create_file' })
  @UseInterceptors(RpcFilesInterceptor('files', 10, multerOptions('boards')))
  async uploadFile(
    @Payload('userid') userid: string,
    @Payload('files') files: Express.Multer.File[],
  ): Promise<MicroserviceDataWrapper> {
    const fileInfoResult = await this.fileService.uploadFile(
      userid,
      files,
      'boards',
    );

    if (typeof fileInfoResult === 'number') {
      return {
        success: false,
        code: fileInfoResult,
      };
    }

    const success = fileInfoResult !== null;
    const code = success
      ? HttpStatus.CREATED
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const result = fileInfoResult;

    return {
      success,
      code,
      result,
    };
  }
}
