import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserMicroserviceDto } from './data/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async signUp(
    @Payload('user') user: UserCreateDto,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.createUser(user);
    const success = userResult !== null;
    const code = success ? HttpStatus.CREATED : HttpStatus.NO_CONTENT;

    if (typeof userResult === 'number') {
      return {
        success: false,
        code: userResult,
      };
    }

    const userMsData = new UserMicroserviceDto(userResult);

    const result = [userMsData];
    return {
      success,
      code,
      result,
    };
  }

  @MessagePattern({ cmd: 'read_user' })
  async getUserById(
    @Payload('userid') id: string,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.getUserById(id);
    const success = userResult !== null;
    const code = success ? HttpStatus.OK : HttpStatus.NO_CONTENT;
    if (typeof userResult === 'number') {
      return {
        success: false,
        code: code,
      };
    }

    const userMsData = new UserMicroserviceDto(userResult);
    const result = [userMsData];
    return {
      success,
      code,
      result,
    };
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUserInfo(@Payload('user') user: UserCreateDto) {
    return this.userService.modifyUserInformation(user);
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(@Payload('user') user: UserMicroserviceDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'auth_user' })
  async logIn(
    @Payload('password') password: string,
    @Payload('email') email: string,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.logIn(password, email);

    const success = userResult !== null;
    const code = success ? HttpStatus.OK : HttpStatus.NO_CONTENT;

    if (typeof userResult === 'number') {
      return {
        success: false,
        code: code,
      };
    }

    const userMsData = new UserMicroserviceDto(userResult);
    const result = [userMsData];
    return {
      success,
      code,
      result,
    };
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(
    @Payload('email') email: string,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.resetPassword(email);
    const success = userResult !== null;
    const code = success ? HttpStatus.OK : HttpStatus.NO_CONTENT;

    if (typeof userResult === 'number') {
      return {
        success: false,
        code: code,
      };
    }
    const userMsData = new UserMicroserviceDto(userResult);
    const result = [userMsData];

    return {
      success,
      code,
      result,
    };
  }
}
