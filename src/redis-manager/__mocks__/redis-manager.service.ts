import { mockUserMicroserviceDtoStub } from '../../user/test/stubs/user-microservice.mock.dto';

export const CACHE_MANAGER = {
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(mockUserMicroserviceDtoStub()),
  del: jest.fn().mockResolvedValue('OK'),
  reset: jest.fn().mockResolvedValue('OK'),
};
