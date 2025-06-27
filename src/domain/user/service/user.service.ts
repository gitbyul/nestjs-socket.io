import { Injectable, NotFoundException } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { AdminService } from './admin.service';
import { AuthorService } from './author.service';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly authorService: AuthorService,
    private readonly advertiserService: AdvertiserService,
    private readonly adminService: AdminService,
  ) {}

  async existsById(id: string, userRole: UserRole) {
    switch (userRole) {
      case UserRole.AUTHOR:
        return this.authorService.existsById(id);
      case UserRole.ADVERTISER:
        return this.advertiserService.existsById(id);
      case UserRole.ADMIN:
        return this.adminService.existsByEmail(id);
      default:
        throw new NotFoundException('User not found');
    }
  }

  async getUserById(id: string, userRole: UserRole) {
    switch (userRole) {
      case UserRole.AUTHOR:
        return this.authorService.getAuthorById(id);
      case UserRole.ADVERTISER:
        return this.advertiserService.getAdvertiserById(id);
      case UserRole.ADMIN:
        return this.adminService.getAdminUserByEmail(id);
      default:
        throw new NotFoundException('User not found');
    }
  }
}
