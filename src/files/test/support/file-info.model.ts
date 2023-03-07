import { FileInfo } from './../../data/file-info.schema';
import { mockFileInfoMicroServiceDto } from '../stubs/microservice-data-wrapper.stub';
import { MockModel } from '../../../database/test/support/mock.model';

export class FileInfoModel extends MockModel<FileInfo> {
  protected entityStub = mockFileInfoMicroServiceDto as FileInfo;
}
