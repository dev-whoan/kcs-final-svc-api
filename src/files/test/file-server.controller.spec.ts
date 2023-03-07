import { multerFileMock } from './stubs/multer-file.stub';
import { MicroserviceDataWrapper } from './../../common/data/microservice-data-wrapper';
import {
  microServiceGetDataStub,
  microServiceCreatedDataStub,
  mockFileInfoMicroServiceDto,
} from './stubs/microservice-data-wrapper.stub';
import { FileServerService } from '../file-server.service';
import { FileServerController } from '../file-server.controller';
import { Test } from '@nestjs/testing';

//* Find Actual Service, It will Auto Mock from __mocks__
jest.mock('../file-server.service');

//* Testing Service Works Or Not
//* Because Controller is calling Service Not the Other Logics
describe('FileServerController', () => {
  //* Create Testing Module and Every Need Things
  let controller: FileServerController;
  let service: FileServerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [FileServerController],
      //* Providers Need to Use Above Things
      //* Need to create 'Mock' of the providers
      //* Which allows you to test (spy) the functions
      //* Basically, Dependencies!
      //* AutoMocking -> Creating __mock__ directory under the root of domain
      //* For example, __mock__/file-server.service.ts
      providers: [FileServerService],
    }).compile();

    controller = moduleRef.get<FileServerController>(FileServerController);
    service = moduleRef.get<FileServerService>(FileServerService);
    //* useful to modify mock, return value, ...
    //* clear each cache
    jest.clearAllMocks();
  });

  //* Test Each Function
  describe('getFileInfo', () => {
    //* Make Sure that the Right Function is Called
    describe('when getFileInfo is called', () => {
      let data: MicroserviceDataWrapper;

      //* Call the function through the controller
      beforeEach(async () => {
        data = await controller.getFileInfo(mockFileInfoMicroServiceDto);
      });

      //* Controller may call the function through the service
      test('then it should call fileServerService', () => {
        //* With the Given Parameter
        expect(service.getFileInfo).toBeCalledWith(
          mockFileInfoMicroServiceDto.id,
        );
      });

      //* And the result should be microServiceGetDataStub()
      //* Which is Mock Data
      test('then it should return a MicroserviceDataWrapper', () => {
        expect(data).toEqual(microServiceGetDataStub());
      });
    });
  });

  describe('uploadFile', () => {
    describe('when uploadFile is called', () => {
      let data: MicroserviceDataWrapper;

      //    @Payload('userid') userid: string,
      //    @Payload('files') files: Express.Multer.File[],
      beforeEach(async () => {
        data = await controller.uploadFile(mockFileInfoMicroServiceDto.owner, [
          multerFileMock(),
        ]);
      });

      test('then it should call fileServerService', () => {
        expect(service.uploadFile).toBeCalledWith(
          mockFileInfoMicroServiceDto.owner,
          [multerFileMock()],
        );
      });

      test('then it should return a MicroserviceDataWrapper', () => {
        expect(data).toEqual(microServiceCreatedDataStub());
      });
    });
  });
});
