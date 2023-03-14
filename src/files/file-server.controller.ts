import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcFilesInterceptor } from '../common/interceptor/file-payload-interceptor/rpc-files.interceptor';
import { MicroserviceDataLogger } from '../common/interceptor/logger/logger.interceptor';
import { multerOptions } from '../common/interceptor/file-payload-interceptor/multer/multer.options';
import { FileServerService } from './file-server.service';
import { SuccessInterceptor } from '../common/interceptor/success/success.interceptor';
import { FileInfo } from './data/file-info.schema';

@Controller('files')
@UseInterceptors(MicroserviceDataLogger('FileServerController'))
export class FileServerController {
  private logger = new Logger('FileServerController');
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FileServerService) {}

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'read_file' })
  async getFileInfo(@Payload('fileid') fileid: string) {
    return await this.fileService.getFileInfo(fileid);
  }

  @MessagePattern({ cmd: 'create_file' })
  @UseInterceptors(
    RpcFilesInterceptor('files', 10, multerOptions('boards')),
    SuccessInterceptor(HttpStatus.CREATED),
  )
  async uploadFile(
    @Payload('userid') userid: string,
    @Payload('files') files: Express.Multer.File[],
  ) {
    this.logger.debug('??');
    return await this.fileService.uploadFile(userid, files, 'boards');
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'delete_file' })
  async deleteFile(
    @Payload('fileid') fileid: string,
    @Payload('userid') userid: string,
  ) {
    this.logger.debug('deleteFile:', fileid);
    return await this.fileService.deleteFile(fileid, userid);
  }
}
