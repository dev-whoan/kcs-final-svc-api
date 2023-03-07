import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MicroserviceDataWrapper } from 'src/common/data/microservice-data-wrapper';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { FilesMicroServiceDto } from './dto/file-ms.dto';
import { Files } from './file.schema';

@Injectable()
export class FilesRepository {
  private readonly redisPrefixKey = 'file';

  constructor(
    @InjectModel(Files.name)
    private readonly fileModel: Model<Files>,
    private readonly redisService: RedisManagerService,
  ) {}

  async getFileInfo(fileid: string): Promise<MicroserviceDataWrapper> {
    //* First find on Redis
    //* If not exist on REdis, find on DB, and add it to Redis, and return it
    const key = `${this.redisPrefixKey}/${fileid}`;
    const redisResult = await this.redisService.getCache(key);
    if (!!redisResult) {
      return {
        success: true,
        code: HttpStatus.OK,
        result: redisResult,
      };
    }

    const dbResult = (await this.fileModel.findOne({
      _id: fileid,
    })) as FilesMicroServiceDto;

    if (!!dbResult) {
      return {
        success: true,
        code: HttpStatus.OK,
        result: dbResult,
      };
    }

    return {
      success: true,
      code: HttpStatus.NO_CONTENT,
    };
  }

  async createFile(fileInfo) {
    //* Just Add it on DB
    return await this.fileModel.create(fileInfo);
  }
}
