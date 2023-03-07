import { CACHE_MANAGER, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { RedisManagerModule } from '../../redis-manager/redis-manager.module';
import { FilesRepository } from './file.repository';
import { Files, FilesSchema } from './file.schema';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

const mockRepository = {
  findOne: jest.fn(),
};

const mockDto = {
  success: true,
  code: HttpStatus.OK,
  dbResult: {
    _id: '6405a8ef83fed38c5f2ad9b8',
    owner: 'test-userid',
    filePath:
      '/Users/eugene/Playground/NodeJS/nestjs/kcs/file-server/dist/common/uploads/board/1678092527694.png',
    fileName: '1678092527694',
    originalName: '스크린샷 2023-02-23 오후 4.47.09.png',
    created_at: '2023-03-06T08:48:47.700Z',
    updated_at: '2023-03-06T08:48:47.700Z',
    __v: 0,
  },
};

describe('FilesRepository', () => {
  let fileRepository: FilesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([{ name: Files.name, schema: FilesSchema }]),
        RedisManagerModule,
      ],
      providers: [
        {
          provide: getModelToken(Files.name),
          useValue: mockRepository,
        },
        FilesRepository,
        RedisManagerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    fileRepository = module.get<FilesRepository>(FilesRepository);
  });

  it('should be defined', () => {
    expect(fileRepository).toBeDefined();
  });

  it('get file info should return mockData', async () => {
    const spy = jest
      .spyOn(fileRepository, 'getFileInfo')
      .mockResolvedValueOnce(mockDto);

    const res = await fileRepository.getFileInfo('6405a8ef83fed38c5f2ad9b8');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual(mockDto);
  });

  it('save string into local disk', async () => {
    const spy = jest
      .spyOn(fileRepository, 'createFile')
      .mockResolvedValueOnce();
  });
});
