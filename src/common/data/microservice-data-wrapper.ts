import { FilesMicroServiceDto } from '../../files/data/dto/file-ms.dto';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: FilesMicroServiceDto;
}
