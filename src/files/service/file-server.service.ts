import { Injectable } from '@nestjs/common';
import multer from 'multer';
import { saveFile } from 'src/common/utils/file.manager';
import { multerOptions } from 'src/common/utils/multer.options';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';
import { FilesCreateDto } from '../data/dto/file.create.dto';
import { FilesRepository } from '../data/file.repository';

@Injectable()
export class FileServerService {
  private readonly redisPrefixKey = 'file';
  constructor(
    private readonly redisService: RedisManagerService,
    private readonly fileRepository: FilesRepository,
  ) {}

  async getFileInfo(fileid: string) {
    return this.fileRepository.getFileInfo(fileid);
    // //* First find on Redis
    // //* If not exist on REdis, find on DB, and add it to Redis, and return it
    // const key = `${this.redisPrefixKey}/${fileid}`;
    // const result = await this.redisService.getCache(key);
    // if (!!result) {
    //   return {
    //     success: true,
    //     result,
    //   };
    // }

    // return {
    //   success: false,
    // };
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

        console.log(oneFile);
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

    //* cat.id와 일치하는 고양이의 파일 변경
    // const newCat = await this.fileRepository.findByIdAndUpdateImg(
    //   cat.id,
    //   fileName,
    // );

    // return this.fileRepository.uploadFile(fileInfo);
    // //* Just Add it on DB
    // console.log('UploadFile');
    // const key = `${this.redisPrefixKey}/${fileInfo.fileid}`;
    // const result = await this.redisService.setCache(key, fileInfo);
    // if (!!result) {
    //   return {
    //     success: true,
    //     result,
    //   };
    // }
    // //* hey
    // return {
    //   success: false,
  }
}
