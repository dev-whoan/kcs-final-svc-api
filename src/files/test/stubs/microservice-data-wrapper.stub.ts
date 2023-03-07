import { FileInfo } from './../../data/file-info.schema';
import { FileInfoMicroServiceDto } from './../../data/dto/file-info.ms.dto';
import { HttpStatus } from '@nestjs/common';
import { MicroserviceDataWrapper } from './../../../common/data/microservice-data-wrapper';

export const mockFileInfoMicroServiceDto: FileInfoMicroServiceDto = {
  owner: 'test-owner',
  id: '6407201654f23c80ad6c3bf1',
  filePath: 'test-path',
  fileName: 'test-name',
};

export const microServiceGetDataStub = (): MicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.OK,
    result: [mockFileInfoMicroServiceDto],
  };
};

export const microServiceCreatedDataStub = (): MicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.CREATED,
    result: [mockFileInfoMicroServiceDto],
  };
};

export const microServiceDeletedDataStub = (): MicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.OK,
    result: true,
  };
};
