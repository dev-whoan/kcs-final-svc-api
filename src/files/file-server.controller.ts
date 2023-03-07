import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { FileInfoMicroServiceDto } from './data/dto/file-info.ms.dto';
import { FileServerService } from './file-server.service';

@Controller('files')
export class FileServerController {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FileServerService) {}

  @Get()
  getFileInfoHttp() {
    return this.fileService.getFileInfo('6405a8ef83fed38c5f2ad9b8');
  }

  @MessagePattern({ cmd: 'read_file' })
  async getFileInfo(
    @Payload() data: FileInfoMicroServiceDto,
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

  //async uploadFile(user: Users, files: Array<Express.Multer.File>)
  @MessagePattern({ cmd: 'create_file' })
  // @UseInterceptors(FilesInterceptor('files', 10, multerOptions('boards')))
  async uploadFile(
    @Payload('userid') userid: string,
    @Payload('files') files: Express.Multer.File[],
  ): Promise<MicroserviceDataWrapper> {
    const fileInfoResult = await this.fileService.uploadFile(userid, files);
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
