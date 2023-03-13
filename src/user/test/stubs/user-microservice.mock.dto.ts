import { HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { UserCreateDto } from 'src/user/data/dto/user-create.dto';
import { MicroserviceDataWrapper } from '../../../common/data/microservice-data-wrapper';
import { UserMicroserviceDto } from '../../../user/data/dto/user.dto';

export const mockUserMicroserviceDtoStub = (): UserMicroserviceDto => {
  return {
    id: 'test-id',
    email: 'test@test.com',
    nickname: 'test-nickname',
    profileimage: 'test-profile',
    password: 'test-password',
  };
};

export const mockMicroCreatedstub = (): MicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.CREATED,
    result: [new UserMicroserviceDto(mockUserMicroserviceDtoStub())],
  };
};

export const mockMicroserviceDataWrapperStub = (): MicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.OK,
    result: [new UserMicroserviceDto(mockUserMicroserviceDtoStub())],
  };
};

export const mockUsercreateDto: UserCreateDto = {
  email: 'test-user',
  nickname: 'test-nickname',
  password: 'test-password',
};
