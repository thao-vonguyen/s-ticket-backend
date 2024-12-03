import { Controller, Get, Param, Delete, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateEmailDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('validate')
  validate(@Body() body: ValidateEmailDto) {
    return this.userService.validate(body.email);
  }
}
