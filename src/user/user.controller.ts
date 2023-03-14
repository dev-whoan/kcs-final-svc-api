import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SuccessInterceptor } from '../common/interceptor/success/success.interceptor';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserMicroserviceDto } from './data/dto/user.dto';
import { UserService } from './user.service';
import { MicroserviceDataLogger } from '../common/interceptor/logger/logger.interceptor';

@Controller('users')
@UseInterceptors(MicroserviceDataLogger('UserController'))
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(SuccessInterceptor(HttpStatus.CREATED))
  @MessagePattern({ cmd: 'create_user' })
  async signUp(@Payload('user') user: UserCreateDto) {
    return await this.userService.createUser(user);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'read_user' })
  async getUserById(@Payload('userid') id: string) {
    return await this.userService.getUserById(id);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'update_user' })
  async updateUserInfo(
    @Payload('user') user: UserCreateDto,
    @Payload('userid') userid: string,
  ) {
    return await this.userService.modifyUserInformation(user, userid);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(@Payload('user') user: UserMicroserviceDto) {
    this.logger.debug('controller.deleteUser:', user);
    return await this.userService.deleteUser(user);
    //    return this.userService.getUser('user/test');
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'auth_user' })
  async logIn(
    @Payload('password') password: string,
    @Payload('email') email: string,
  ) {
    return await this.userService.logIn(password, email);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'find_user' })
  async findUser(@Payload('email') email: string) {
    return await this.userService.resetPassword(email);
  }
}
