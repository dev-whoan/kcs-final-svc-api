import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';
import { FileServerService } from '../service/file-server.service';

@Controller('files')
export class FileServerController {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FileServerService) {}

  @MessagePattern({ cmd: 'read_file' })
  getFileInfo(@Payload() data: FilesMicroServiceDto) {
    return this.fileService.getFileInfo(`${data.id}`);
  }

  //async uploadFile(user: Users, files: Array<Express.Multer.File>)
  @MessagePattern({ cmd: 'create_file' })
  // @UseInterceptors(FilesInterceptor('files', 10, multerOptions('boards')))
  uploadFile(
    @Payload('userid') userid: string,
    @Payload('files') files: Express.Multer.File[],
  ) {
    console.log('Files:', files);
    console.log('userid:', userid);
    return this.fileService.uploadFile(userid, files);
  }
}
