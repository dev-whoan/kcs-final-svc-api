import {
  mockMicroCreatedstub,
  mockUserMicroserviceDtoStub,
} from '../test/stubs/user-microservice.mock.dto';

//* resetPassword returns UserMicroserviceDto
export const UserService = jest.fn().mockReturnValue({
  resetPassword: jest.fn().mockResolvedValue(mockUserMicroserviceDtoStub()),
  getUserById: jest.fn().mockResolvedValue(mockUserMicroserviceDtoStub()),
  login: jest.fn().mockResolvedValue(mockUserMicroserviceDtoStub()),
  createUser: jest.fn().mockResolvedValue(mockUserMicroserviceDtoStub()),
  sendMail: jest.fn().mockResolvedValue(200),
});
