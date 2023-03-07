import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisManagerService } from './redis-manager.service';
import * as redisStore from 'cache-manager-ioredis';
import { RedisManagerModule } from './redis-manager.module';
import { Cache } from 'cache-manager';
import { FilesMicroServiceDto } from '../files/data/dto/file-ms.dto';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

const mockDto = new FilesMicroServiceDto({
  owner: 'test-owner',
  filePath: 'test-filepath',
  fileName: 'test-filename',
});

describe('RedisManagerService', () => {
  let redisService: RedisManagerService;
  let cache: Cache;
  beforeEach(async () => {
    //* Mocking Module
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register({
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
        RedisManagerModule,
      ],
      providers: [
        RedisManagerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    redisService = moduleRef.get<RedisManagerService>(RedisManagerService);
    cache = moduleRef.get(CACHE_MANAGER);
  });

  describe('set', () => {
    it('should be defined', () => {
      expect(redisService.setCache).toBeDefined();
    });

    it('should return Ok', async () => {
      const spy = jest.spyOn(cache, 'set');
      await redisService.setCache('test', mockDto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toEqual('test');
      expect(spy.mock.calls[0][1]).toEqual(mockDto);
    });
  });

  describe('get', () => {
    it('should be defined', () => {
      expect(redisService.getCache).toBeDefined();
    });

    it('should return test', async () => {
      const spy = jest.spyOn(cache, 'get').mockResolvedValueOnce(mockDto);

      const res = await redisService.getCache('test');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockDto);
    });
  });
  describe('del', () => {
    it('should be defined', () => {
      expect(redisService.deleteCache).toBeDefined();
    });

    it('should return "OK"', async () => {
      const result = await redisService.deleteCache('test');
      expect(result).toBe('OK');
    });
  });
});
