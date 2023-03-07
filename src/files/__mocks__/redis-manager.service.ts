import { mockFileInfoMicroServiceDto } from './../test/stubs/microservice-data-wrapper.stub';
//* Mock Functions that Actual FileServerService Provides
//* Each Functions will Return What Exactly It Returns
//* This Case, MicroserviceDataWrapper
//* And Also Need to Create Mock Model of it, under domain/test/stubs/
/*
  success: boolean;
  code: number;
  result?: FilesMicroServiceDto;
*/
export const RedisManagerService = jest.fn().mockReturnValue({
  getCache: jest.fn().mockImplementation((key) => {
    if (key === 'file/no-data') {
      return null;
    }
    return mockFileInfoMicroServiceDto;
  }),
  setCache: jest.fn().mockResolvedValue('OK'),
  deleteCache: jest.fn().mockResolvedValue('OK'),
  resetCache: jest.fn().mockResolvedValue('OK'),
});
