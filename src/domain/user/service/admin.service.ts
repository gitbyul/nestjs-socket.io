import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
  async getAdminUserByEmailWithTransaction(
    manager: EntityManager,
    email: string,
  ) {
    return await manager.findOne(AdminUser, { where: { email } });
  }
}
