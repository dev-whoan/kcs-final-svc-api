import { ApiProperty, PickType } from '@nestjs/swagger';
import { FileInfo } from '../file-info.schema';

export class FileInfoMicroserviceDto extends PickType(FileInfo, [
  'owner',
  'filePath',
  'fileName',
] as const) {
  @ApiProperty({
    example: 'ObjectID',
    description: 'id',
  })
  id: string;
}
