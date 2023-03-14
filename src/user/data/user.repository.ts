import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { UserMicroserviceDto } from './dto/user.dto';

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

  async update(user: UserCreateDto, userid: string): Promise<User | number> {
    try {
      const result = await this.userModel.findById(userid);

      result.password = await bcrypt.hash(user.password, 10);
      result.nickname = user.nickname;

      const newUser = await result.save();

      const iKey = `${this.redisPrefixKey}/${newUser.id}`;
      const eKey = `${this.redisPrefixKey}/${newUser.email}`;
      await this.redisService.deleteCache(iKey);
      await this.redisService.deleteCache(eKey);

      return newUser.readOnlyData as User;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async findById(id: string): Promise<User | number> {
    try {
      //* First find on Redis
      //* If not exist on REdis, find on DB, and add it to Redis, and return it
      const key = `${this.redisPrefixKey}/${id}`;
      const redisResult = await this.redisService.getCache(key);

      this.logger.log('findById.redisResult:', !!redisResult);
      this.logger.debug(redisResult);

      if (!!redisResult) {
        return redisResult;
      }

      const dbResult = await this.userModel.findById(id);

      this.logger.log(`findById.dbResult: ${!!dbResult}`);
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

      const redisResult = await this.redisService.getCache(key);

      this.logger.log('findByEmail.redisResult:', !!redisResult);
      this.logger.debug(redisResult);

      if (!!redisResult) {
        return redisResult;
      }
      const dbResult = await this.userModel.findOne({
        email,
      });

      this.logger.log(`findByEmail.dbResult: ${!!dbResult}`);
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

  async removeById(id: string, email: string): Promise<number> {
    const iKey = `${this.redisPrefixKey}/${id}`;
    const eKey = `${this.redisPrefixKey}/${email}`;
    await this.redisService.deleteCache(iKey);
    await this.redisService.deleteCache(eKey);

    try {
      await this.userModel.deleteOne({ id });
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
