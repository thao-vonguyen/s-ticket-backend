import { Controller, Param, Body, Post, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateEmailDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('validate')
  validate(@Body() body: ValidateEmailDto) {
    return this.userService.validate(body.email);
  }

  @Patch(':id')
  updateUser(@Body() body: Partial<User>, @Param('id') id: string) {
    return this.userService.updateUser(id, body);
  }

  @Post()
  createUser(@Body() body: User) {
    return this.userService.createUser(body);
  }
}
