import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../entity/AdminUser.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
  ) {}

  async existsByEmail(email: string) {
    return await this.adminUserRepository.exists({
      where: { email },
    });
  }

  async getAdminUserByEmail(email: string) {
    return this.adminUserRepository.findOne({ where: { email } });
  }
}
