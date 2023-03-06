import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { FilesMicroServiceDto } from './dto/file-ms.dto';
import { FilesCreateDto } from './dto/file.create.dto';
import { Files } from './file.schema';

@Injectable()
export class FilesRepository {
  private readonly redisPrefixKey = 'file';

  constructor(
    @InjectModel(Files.name)
    private readonly fileModel: Model<Files>,
    private readonly redisService: RedisManagerService,
  ) {}

  async getFileInfo(fileid: string) {
    //* First find on Redis
    //* If not exist on REdis, find on DB, and add it to Redis, and return it
    const key = `${this.redisPrefixKey}/${fileid}`;
    const result = await this.redisService.getCache(key);
    if (!!result) {
      return {
        success: true,
        result,
      };
    }

    return {
      success: false,
    };
  }

  async createFile(fileInfo) {
    //* Just Add it on DB
    return await this.fileModel.create(fileInfo);
  }
}
