import { UserService } from './users.service';
import { Controller, DefaultValuePipe, Get, Logger, ParseIntPipe, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
  ) {
    this.logger.log('Get all users');
    const result = await this.userService.findAll(limit, offset);

    const users = result.users.map((user) => UsersResponseDto.fromUsersEntity(user));
    const total = result.total

    return { users, total }
  }
}
