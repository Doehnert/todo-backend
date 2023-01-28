import { OmitType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class IndexUserSwagger extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
