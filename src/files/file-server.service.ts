import { FileInfoMicroserviceDto } from './data/dto/file-info.ms.dto';
import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { FileInfoRepository } from './data/file.repository';
import * as path from 'path';
import { FileInfoCreateDto } from './data/dto/file-info.create.dto';

@Injectable()
export class FileServerService {
  private logger = new Logger('FileServerService');
  constructor(private readonly fileRepository: FileInfoRepository) {}

  async getFileInfo(fileid: string): Promise<FileInfoMicroserviceDto> {
    return (await this.fileRepository.findById(
      fileid,
    )) as FileInfoMicroserviceDto;
  }

  async uploadFile(
    userid: string,
    files: Express.Multer.File[],
    folder: string,
  ): Promise<FileInfoMicroserviceDto[] | number> {
    //* 업로드 된 파일 이름 획득
    try {
      const saveResult: FileInfoMicroserviceDto[] = [];

      files.forEach(async (file, index) => {
        const originalName = file.originalname;
        const newName = Date.now().toString();
        const destination = path.join(process.env.PWD, `uploads/${folder}`);
        const newFileName = newName + path.extname(originalName);
        const finalPath = path.join(destination, newFileName);

        const oneFile = new FileInfoCreateDto({
          owner: userid,
          originalName,
          filePath: destination,
          fileName: newFileName,
        });

        saveResult.push(
          (await this.fileRepository.storeFileInfoInDatabase(
            oneFile,
          )) as FileInfoMicroserviceDto,
        );

        //* db 저장
      });

      return saveResult;
    } catch (err) {
      this.logger.error(
        `Error Occured While uploadFile [${userid}]`,
        err.stack || err,
      );

      return HttpStatus.BAD_REQUEST;
    }
  }
}
