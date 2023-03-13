import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicroserviceDataWrapper } from '../../common/data/microservice-data-wrapper';
import { UserCreateDto } from './dto/user-create.dto';
import { UserMicroserviceDto } from './dto/user.dto';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  private logger = new Logger('UserRepository');
  private readonly redisPrefixKey = 'file';
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly redisService: RedisManagerService,
  ) {}

  async create(user: UserCreateDto): Promise<User | number> {
    try {
      const result = await this.userModel.create(user);
      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      if (e.message.includes('E11000')) {
        return HttpStatus.CONFLICT;
      }
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async find() {}

  async findById(id: string): Promise<User | number> {
    try {
      //* First find on Redis
      //* If not exist on REdis, find on DB, and add it to Redis, and return it
      console.log(id);
      const key = `${this.redisPrefixKey}/${id}`;
      const redisResult = await this.redisService.getCache(key);

      this.logger.log('findById.redisResult:', !!redisResult);
      this.logger.debug(redisResult);

      if (!!redisResult) {
        return redisResult;
      }

      const dbResult = await this.userModel.findById(id);

      this.logger.log('findById.dbResult:', !!dbResult);
      this.logger.debug(dbResult);

      if (!!dbResult) {
        await this.redisService.setCache(key, dbResult);
        return dbResult;
      }

      return HttpStatus.NO_CONTENT;
    } catch (e) {
      this.logger.error(`[findById] ${e.message}`);
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async findByEmail(email: string): Promise<User | number> {
    try {
      //* First find on Redis
      //* If not exist on REdis, find on DB, and add it to Redis, and return it
      const key = `${this.redisPrefixKey}/${email}`;
      /*
      const redisResult = await this.redisService.getCache(key);

      this.logger.log('findByEmail.redisResult:', !!redisResult);
      this.logger.debug(redisResult);

      if (!!redisResult) {
        return redisResult;
      }
*/
      const dbResult = await this.userModel.findOne({
        email,
      });

      this.logger.log('findByEmail.dbResult:', !!dbResult);
      this.logger.debug(dbResult);

      if (!!dbResult) {
        await this.redisService.setCache(key, dbResult);
        return dbResult;
      }

      return null;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
