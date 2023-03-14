import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { FileInfo, FileInfoReadOnly } from './file-info.schema';

@Injectable()
export class FileInfoRepository {
  private logger = new Logger('FileInfoRepository');
  private readonly redisPrefixKey = 'file';

  constructor(
    @InjectModel(FileInfo.name)
    private readonly fileModel: Model<FileInfo>,
    private readonly redisService: RedisManagerService,
  ) {}

  async findById(id: string): Promise<FileInfo | null> {
    //* First find on Redis
    //* If not exist on REdis, find on DB, and add it to Redis, and return it
    const key = `${this.redisPrefixKey}/${id}`;
    const redisResult = await this.redisService.getCache(key);

    this.logger.log(`findById.redisResult: ${!!redisResult}`);
    this.logger.debug(redisResult);

    if (!!redisResult) {
      return redisResult;
    }
    this.logger.debug('findById.id: ', id);
    const dbResult = await this.fileModel.findById(id);

    this.logger.log(`findById.dbResult: ${!!dbResult}`);
    this.logger.debug(dbResult);

    if (!!dbResult) {
      if (dbResult.removed) {
        return null;
      }

      await this.redisService.setCache(key, dbResult);
      return dbResult;
    }

    return null;
  }

  async storeFileInfoInDatabase(fileInfo): Promise<FileInfo> {
    //* Just Add it on DB
    return await this.fileModel.create(fileInfo);
  }

  async removeById(fileid: string): Promise<number> {
    const iKey = `${this.redisPrefixKey}/${fileid}`;
    await this.redisService.deleteCache(iKey);

    try {
      const result = await this.fileModel.findById(fileid);

      // await this.fileModel.deleteOne({ id });
      result.removed = true;
      result.removedAt = Date.now();
      await result.save();
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
