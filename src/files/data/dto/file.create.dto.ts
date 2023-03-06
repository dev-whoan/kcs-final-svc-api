import { PickType } from '@nestjs/swagger';
import { Files } from '../file.schema';

export class FilesCreateDto extends PickType(Files, [
  'owner',
  'fileName',
  'originalName',
  'filePath',
] as const) {
  constructor(partial: Partial<FilesCreateDto>) {
    super();
    Object.assign(this, partial);
  }
}
