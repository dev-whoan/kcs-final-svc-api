import { ApiProperty, PickType } from '@nestjs/swagger';
import { Files } from '../file.schema';

export class FilesMicroServiceDto extends PickType(Files, [
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
