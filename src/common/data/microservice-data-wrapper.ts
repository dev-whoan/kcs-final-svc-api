import { FileInfo, FileInfoReadOnly } from 'src/files/data/file-info.schema';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: FileInfoReadOnly[] | boolean;
}
