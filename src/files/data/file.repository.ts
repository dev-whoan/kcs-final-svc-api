import { FileInfoMicroServiceDto } from './dto/file-info.ms.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MicroserviceDataWrapper } from '../../common/data/microservice-data-wrapper';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { FileInfo } from './file-info.schema';

@Injectable()
export class FileInfoRepository {
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

    if (!!redisResult) {
      return redisResult;
    }

    const dbResult = await this.fileModel.findById({
      id,
    });

    if (!!dbResult) {
      return dbResult;
    }

    return null;
  }

  async storeFileInfoInDatabase(fileInfo): Promise<FileInfo> {
    //* Just Add it on DB
    return await this.fileModel.create(fileInfo);
  }
}
