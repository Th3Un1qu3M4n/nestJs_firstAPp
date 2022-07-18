import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SerializedUser } from './interfaces/user.interface';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { CreateUserDTO } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findUserByUsername(username);

    if (user) return new SerializedUser(user);
    // else throw new NotFoundException();
    else throw new UserNotFoundException();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }
}
