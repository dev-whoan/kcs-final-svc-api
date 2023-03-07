import { mockFileInfoMicroServiceDto } from './../../files/test/stubs/microservice-data-wrapper.stub';
export const mockCacheManager = jest.fn().mockReturnValue({
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(mockFileInfoMicroServiceDto),
  del: jest.fn().mockResolvedValue('OK'),
  reset: jest.fn().mockResolvedValue('OK'),
});
