import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { FileInfoRepository } from './data/file.repository';
import * as path from 'path';
import { FileInfoCreateDto } from './data/dto/file-info.create.dto';
import { FileInfo } from './data/file-info.schema';

@Injectable()
export class FileServerService {
  private logger = new Logger('FileServerService');
  constructor(private readonly fileRepository: FileInfoRepository) {}

  async getFileInfo(fileid: string) {
    const result = await this.fileRepository.findById(fileid);
    this.logger.debug('getFileInfo.fileid:', fileid);
    this.logger.debug('getFileInfo.result', result);
    if (!result) {
      return HttpStatus.NO_CONTENT;
    }
    return result.readOnlyData;
  }

  async uploadFile(
    userid: string,
    files: Express.Multer.File[],
    folder: string,
  ): Promise<FileInfo[] | number> {
    //* 업로드 된 파일 이름 획득
    try {
      const saveResult = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
          size: file.size,
        });

        const saveFile = await this.fileRepository.storeFileInfoInDatabase(
          oneFile,
        );

        saveResult.push(saveFile.readOnlyData);
      }

      return saveResult;
    } catch (err) {
      this.logger.error(
        `Error Occured While uploadFile [${userid}]`,
        err.stack || err,
      );

      return HttpStatus.BAD_REQUEST;
    }
  }

  async deleteFile(fileid: string, userid: string) {
    const targetFile = await this.fileRepository.findById(fileid);
    this.logger.debug('deleteFile.targetFile:', targetFile);

    if (!targetFile) return HttpStatus.NO_CONTENT;
    if (typeof targetFile === 'number') return targetFile;

    if (targetFile.owner !== userid) {
      return HttpStatus.UNAUTHORIZED;
    }

    try {
      return await this.fileRepository.removeById(targetFile.id);
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
