import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSchema } from './User.Schema';

export class UserCreateDTo extends UserSchema {}
