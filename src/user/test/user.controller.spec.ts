import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMicroserviceDto } from '../data/dto/user.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserService as MockUserService } from '../__mocks__/user.service';
import {
  mockMicroCreatedstub,
  mockMicroserviceDataWrapperStub,
  mockUsercreateDto,
  mockUserMicroserviceDtoStub,
} from './stubs/user-microservice.mock.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let mailService: MailerService;

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
    let data: number;
    const testEmail = 'test-email';
    const alter_password = 'pass';
    beforeEach(async () => {
      data = await controller.findUser(testEmail);
      //object dtp
    });

    test('then it should call userService.resetPassword', () => {
      expect(service.resetPassword).toBeCalledWith(testEmail);
    });

    test('then it should return a value', () => {
      expect(data).toEqual(mockUserMicroserviceDtoStub());
    });
  });

  describe('getUserById', () => {
    let data: UserMicroserviceDto;
    const id = 'test-id';
    beforeEach(async () => {
      data = (await controller.getUserById(id)) as UserMicroserviceDto;
    });
    test('then it should call userService.getUserById', () => {
      expect(service.getUserById).toBeCalledWith(id);
    });
    test('then it should return a value', () => {
      expect(data).toEqual(mockUserMicroserviceDtoStub());
    });
  });

  describe('logIn', () => {
    let return_data: UserMicroserviceDto;
    const email = 'test-eamil';
    const password = 'test-password';

    beforeEach(async () => {
      return_data = (await controller.logIn(
        email,
        password,
      )) as UserMicroserviceDto;
    });

    test('should call userService.Login', () => {
      expect(service.logIn).toBeCalledWith(email, password);
    });

    test('should return value', () => {
      expect(return_data).toEqual(mockUserMicroserviceDtoStub());
    });
  });

  describe('signUp', () => {
    let return_data: UserMicroserviceDto;
    const test_user = mockUsercreateDto;

    beforeEach(async () => {
      return_data = (await controller.signUp(test_user)) as UserMicroserviceDto;
    });

    test('should run createuser', () => {
      expect(service.createUser).toBeCalledWith(test_user);
    });
    test('should return value', () => {
      expect(return_data).toEqual(mockUserMicroserviceDtoStub());
    });
  });
});
