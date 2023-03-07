import { FileInfoMicroServiceDto } from './data/dto/file-info.ms.dto';
import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { saveFile } from '../common/utils/file.manager';
import { multerOptions } from '../common/utils/multer.options';
import { FileInfoCreateDto } from './data/dto/file-info.create.dto';
import { FileInfoRepository } from './data/file.repository';

@Injectable()
export class FileServerService {
  private logger = new Logger('FileServerService');
  constructor(private readonly fileRepository: FileInfoRepository) {}

  async getFileInfo(fileid: string): Promise<FileInfoMicroServiceDto> {
    return (await this.fileRepository.findOne(
      fileid,
    )) as FileInfoMicroServiceDto;
  }

  async uploadFile(
    userid: string,
    files: Express.Multer.File[],
  ): Promise<FileInfoMicroServiceDto[]> {
    //* 업로드 된 파일 이름 획득
    const folder = 'board';
    const saveResult: FileInfoMicroServiceDto[] = [];
    //* folder 생성용
    multerOptions(folder);
    try {
      files.forEach(async (file, index) => {
        const { originalname, buffer } = file;
        const { originalName, filePath, fileName } = await saveFile(
          originalname,
          folder,
          buffer,
        );
        const oneFile = new FileInfoCreateDto({
          owner: userid,
          originalName,
          filePath,
          fileName,
        });

        saveResult.push(
          (await this.fileRepository.storeFileInfoInDatabase(
            oneFile,
          )) as FileInfoMicroServiceDto,
        );
      });

      return saveResult;
    } catch (err) {
      this.logger.error(err.stack || err);
      return null;
    }
  }
}
