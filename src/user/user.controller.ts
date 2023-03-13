import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SuccessInterceptor } from '../common/interceptor/success/success.interceptor';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserMicroserviceDto } from './data/dto/user.dto';
import { UserService } from './user.service';
import { MicroserviceDataLogger } from '../common/interceptor/logger/logger.interceptor';

@Controller('users')
@UseInterceptors(SuccessInterceptor(), MicroserviceDataLogger('UserController'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async signUp(@Payload('user') user: UserCreateDto) {
    return await this.userService.createUser(user);
  }

  @MessagePattern({ cmd: 'read_user' })
  async getUserById(@Payload('userid') id: string) {
    return await this.userService.getUserById(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUserInfo(
    @Payload('user') user: UserCreateDto,
    @Payload('userid') userid: string,
  ) {
    return await this.userService.modifyUserInformation(user, userid);
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
  ) {
    return await this.userService.logIn(password, email);
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(@Payload('email') email: string) {
    return await this.userService.resetPassword(email);
  }
}
