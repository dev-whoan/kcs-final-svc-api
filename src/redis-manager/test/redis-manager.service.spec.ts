import { User } from '../../user/data/user.schema';

import { CACHE_MANAGER as MockCacheManager } from '../__mocks__/redis-manager.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { RedisManagerService } from '../redis-manager.service';

describe('RedisManagerController', () => {
  let service: RedisManagerService;
  let cache: Cache;
  const key = 'file/yes-data';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RedisManagerService,
        {
          provide: CACHE_MANAGER,
          useValue: MockCacheManager,
        },
      ],
    }).compile();

    service = moduleRef.get<RedisManagerService>(RedisManagerService);
    cache = moduleRef.get(CACHE_MANAGER);
  });

  describe('when setCache is called', () => {
    let data: string;

    beforeEach(async () => {
      data = await service.setCache(key, mockUserMicroserviceDto as User);
    });

    test('then it should call redis.set', () => {
      expect(cache.set).toBeCalledWith(key, mockUserMicroserviceDto as User);
    });

    test('then it should return a "OK"', () => {
      expect(data).toEqual('OK');
    });
  });

  describe('when getCache is called', () => {
    let data: User;

    //* Call the function through the controller
    beforeEach(async () => {
      data = await service.getCache(key);
    });

    //* Controller may call the function through the service
    test('then it should call redis.get', () => {
      //* With the Given Parameter
      expect(cache.get).toBeCalledWith(key);
    });

    //* And the result should be microServiceGetDataStub()
    //* Which is Mock Data
    test('then it should return a FileInfo', () => {
      expect(data).toEqual(mockUserMicroserviceDto);
    });
  });

  describe('when deleteCache is called', () => {
    let data: string;

    beforeEach(async () => {
      data = await service.deleteCache(key);
    });

    test('then it should call redis.del', () => {
      expect(cache.del).toBeCalledWith(key);
    });

    test('then it should return a "OK"', () => {
      expect(data).toEqual('OK');
    });
  });

  describe('when resetCache is called', () => {
    let data: string;

    beforeEach(async () => {
      data = await service.resetCache();
    });

    test('then it should call redis.reset', () => {
      expect(cache.reset).toBeCalledWith();
    });

    test('then it should return a "OK"', () => {
      expect(data).toEqual('OK');
    });
  });
});
