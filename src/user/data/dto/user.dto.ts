import { Exclude } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserMicroserviceDto extends PickType(User, [
  'id',
  'email',
  'nickname',
  'profileimage',
] as const) {
  //* 예민한 정보 제외

  //* 예민한 정보 제외
  constructor(partial: Partial<UserMicroserviceDto>) {
    super();
    if (!!partial && partial.password) {
      delete partial.password;
    }
    this.id = partial.id;
    this.email = partial.email;
    this.nickname = partial.nickname;
    this.profileimage = partial.profileimage;
  }
}
