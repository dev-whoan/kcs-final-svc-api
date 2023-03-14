import { FileInfoReadOnly } from 'src/files/data/file-info.schema';

export const mockFileInfoMicroServiceDto: FileInfoReadOnly = {
  owner: 'test-owner',
  id: '6407201654f23c80ad6c3bf1',
  filePath: 'test-path',
  fileName: 'test-name',
  size: 12345,
};

export const microServiceCreatedDataStub = (): FileInfoReadOnly[] => {
  return [mockFileInfoMicroServiceDto];
};
