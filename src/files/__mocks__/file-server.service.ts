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
export const FileServerService = jest.fn().mockReturnValue({
  getFileInfo: jest.fn().mockResolvedValue(mockFileInfoMicroServiceDto),
  uploadFile: jest.fn().mockResolvedValue([mockFileInfoMicroServiceDto]),
  deleteFile: jest.fn().mockResolvedValue(mockFileInfoMicroServiceDto),
});
