import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(limit: number, offset: number): Promise<{ users: UsersEntity[], total: number}> {

    const [users, totalCount] = await this.usersRepo.findAndCount({
      skip: offset,
      take: limit
    });


    return { users, total: totalCount }
  }
}
