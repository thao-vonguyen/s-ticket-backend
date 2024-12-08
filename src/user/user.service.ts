import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async validate(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');;
    }
    return user;
  }

  async updateUser(id: string, body: Partial<User>) {
    return this.userRepository.update(id, body);
  }

  async createUser(body: User) {
    return this.userRepository.save(body);
  }
}
