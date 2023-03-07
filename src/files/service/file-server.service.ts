import { Injectable } from '@nestjs/common';
import { saveFile } from '../../common/utils/file.manager';
import { multerOptions } from '../../common/utils/multer.options';
import { FilesCreateDto } from '../data/dto/file.create.dto';
import { FilesRepository } from '../data/file.repository';

@Injectable()
export class FileServerService {
  constructor(private readonly fileRepository: FilesRepository) {}

  async getFileInfo(fileid: string) {
    return this.fileRepository.getFileInfo(fileid);
  }

  async uploadFile(userid: string, files: Express.Multer.File[]) {
    //* 업로드 된 파일 이름 획득
    const folder = 'board';
    const saveResult = [];
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
        const oneFile = new FilesCreateDto({
          owner: userid,
          originalName,
          filePath,
          fileName,
        });

        saveResult.push(await this.fileRepository.createFile(oneFile));
      });
    } catch (err) {
      console.error(err.stack || err);
      return {
        success: false,
        code: 500,
        error: err.message,
      };
    }

    return {
      success: true,
      code: 201,
      result: saveResult,
    };
  }
}
