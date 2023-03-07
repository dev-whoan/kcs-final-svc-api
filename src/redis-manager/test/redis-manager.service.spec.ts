import { FileServerService } from './../../../../api-gateway/src/file-server/service/file-server.service';
import { Test } from '@nestjs/testing';
describe('RedisManagerController', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FileServerService],
    }).compile();
  });
});
