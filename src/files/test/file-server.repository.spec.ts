import { RedisManagerService as MockRedisManagerService } from './../__mocks__/redis-manager.service';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { FileInfo } from './../data/file-info.schema';
import {
  microServiceGetDataStub,
  mockFileInfoMicroServiceDto,
} from './stubs/microservice-data-wrapper.stub';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FileInfoRepository } from '../data/file.repository';
import { FileInfoModel } from './support/file-info.model';

// jest.mock('../../redis-manager/redis-manager.service');

describe('FileInfoRepository', () => {
  let repository: FileInfoRepository;
  //* Use Mock Model
  let model: FileInfoModel;
  let redis: RedisManagerService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        //* Be Sure That, FileInfoRepository Injects MongoDB Scheme
        /*
                @InjectModel(FileInfo.name)
                private readonly fileModel: Model<FileInfo>,
                */
        FileInfoRepository,
        //* So Provide the scheme here
        //* We will use Mock Repository
        //* Which Provide findOne, findById, ...
        //* Provide Model Using Mock Model
        {
          provide: getModelToken(FileInfo.name),
          useClass: FileInfoModel,
        },
        //* And Redis Module
        //* private readonly redisService: RedisManagerService,
        {
          provide: RedisManagerService,
          useClass: MockRedisManagerService,
        },
      ],
    }).compile();

    repository = moduleRef.get<FileInfoRepository>(FileInfoRepository);
    model = moduleRef.get<FileInfoModel>(getModelToken(FileInfo.name));
    redis = moduleRef.get<RedisManagerService>(RedisManagerService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    describe('when findById is called which is stored in redis', () => {
      let fileInfo: FileInfo;

      beforeEach(async () => {
        jest.spyOn(model, 'findById');
        fileInfo = await repository.findById(mockFileInfoMicroServiceDto.id);
      });

      test('it should call the redis', () => {
        expect(redis.getCache).toHaveBeenCalledWith(
          `file/${mockFileInfoMicroServiceDto.id}`,
        );
      });

      test('it should return a fileInfo from redis', () => {
        expect(fileInfo).toEqual(mockFileInfoMicroServiceDto);
      });
    });

    describe('when findById is called which is not stored in redis but db', () => {
      let fileInfo: FileInfo;

      beforeEach(async () => {
        jest.spyOn(model, 'findById');
        fileInfo = await repository.findById('no-data');
      });

      test('it should call the redis', () => {
        expect(redis.getCache).toHaveBeenCalledWith(`file/no-data`);
      });

      test('it should call findById', () => {
        expect(model.findById).toHaveBeenCalledWith({ id: 'no-data' });
      });

      test('it should return a fileInfo from redis', () => {
        expect(fileInfo).toEqual(mockFileInfoMicroServiceDto);
      });
    });
  });
});
