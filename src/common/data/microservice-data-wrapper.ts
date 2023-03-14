import { UserMicroserviceDto } from '../../user/data/dto/user.dto';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: UserMicroserviceDto[] | boolean;
}
