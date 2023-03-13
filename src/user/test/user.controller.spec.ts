import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceDataWrapper } from 'src/common/data/microservice-data-wrapper';
import { UserCreateDto } from '../data/dto/user-create.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserService as MockUserService } from '../__mocks__/user.service';
import {
  mockMicroCreatedstub,
  mockMicroserviceDataWrapperStub,
  mockUsercreateDto,
  mockUserMicroserviceDtoStub,
} from './stubs/user-microservice.mock.dto';

let k: UserCreateDto = new UserCreateDto();

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let mailservice: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('resetPassword', () => {
    let data: MicroserviceDataWrapper;
    const testEmail = 'test-email';
    const alter_password = 'pass';
    beforeEach(async () => {
      data = await controller.resetPassword(testEmail);
      //object dtp
    });

    test('then it should call userService.resetPassword', () => {
      expect(service.resetPassword).toBeCalledWith(testEmail);
    });

    test('then it should return a value', () => {
      expect(data).toEqual(mockMicroserviceDataWrapperStub());
    });
  });

  describe('getUserById', () => {
    let data: MicroserviceDataWrapper;
    const id = 'test-id';
    beforeEach(async () => {
      data = await controller.getUserById(id);
      // console.log('dat는', data);
    });
    test('then it should call userService.getUserById', () => {
      expect(service.getUserById).toBeCalledWith(id);
    });
    test('then it should return a value', () => {
      expect(data).toEqual(mockMicroserviceDataWrapperStub());
    });
  });

  describe('logIn', () => {
    let return_data: MicroserviceDataWrapper;
    const email = 'test-eamil';
    const password = 'test-password';

    beforeEach(async () => {
      return_data = await controller.logIn(email, password);
    });

    test('should call userService.Login', () => {
      expect(service.login).toBeCalledWith(email, password);
    });

    test('should return value', () => {
      expect(return_data).toEqual(mockMicroserviceDataWrapperStub());
    });
  });

  describe('signUp', () => {
    let return_data: MicroserviceDataWrapper;
    let test_user = mockUsercreateDto;

    beforeEach(async () => {
      return_data = await controller.signUp(test_user);
    });

    test('should run createuser', () => {
      expect(service.createUser).toBeCalledWith(test_user);
    });
    test('should return value', () => {
      expect(return_data).toEqual(mockMicroCreatedstub());
    });
  });
});
