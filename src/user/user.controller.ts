import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { resourceUsage } from 'process';
import { MicroserviceDataWrapper } from '../common/data/microservice-data-wrapper';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserMicroserviceDto } from './data/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(
    @Payload('email') email: string,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.resetPassword(email);

    console.log('get my result', userResult);

    const success = userResult !== null;
    const code = success ? HttpStatus.OK : HttpStatus.NO_CONTENT;

    //이메일로 아이디줘야됨
    if (typeof userResult === 'number') {
      return {
        success: false,
        code: code,
      };
    }
    const userMsData = new UserMicroserviceDto(userResult);

    // 유저거ㅏ져온거까지가능
    // 수정해야됨
    // save

    const result = [userMsData];
    console.log('and it have changed into', result);
    return {
      success,
      code,
      result,
    };
  }

  @MessagePattern({ cmd: 'auth_user' })
  async logIn(
    @Payload('password') password: string,
    @Payload('email') email: string,
  ): Promise<MicroserviceDataWrapper> {
    const userResult = await this.userService.login(password, email);

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

  @MessagePattern({ cmd: 'update_user' })
  updateUserInfo(@Payload('user') user: UserCreateDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(@Payload('user') user: UserMicroserviceDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @Get('random')
  async random() {
    const k = Math.random().toString(36).slice(2);

    return k;
  }
  @Get('send')
  async send_mail() {
    /*
    this.mailerService
      .sendMail({
        to: 'wlwhs5014@naver.com',
        from: 'wlwhs3154@gmail.com',
        subject: '이거되나요?',
        text: 'hihi',
      })
      .then((result) => {
        console.log('성공함?');
        console.log(result);
      })
      .catch((e) => {
        console.log('에러');
        console.log(e);
      });
    return '메일 보내짐?';
  */
  }
}
