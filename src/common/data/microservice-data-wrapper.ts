import { FileInfoMicroServiceDto } from '../../files/data/dto/file-info.ms.dto';
export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: FileInfoMicroServiceDto[] | boolean;
}
