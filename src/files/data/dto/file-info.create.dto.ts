import { PickType } from '@nestjs/swagger';
import { FileInfo } from '../file-info.schema';

export class FileInfoCreateDto extends PickType(FileInfo, [
  'id',
  'owner',
  'fileName',
  'originalName',
  'filePath',
  'size',
] as const) {
  constructor(partial: Partial<FileInfoCreateDto>) {
    super();
    Object.assign(this, partial);
  }
}
