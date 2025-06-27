import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entity/Author.entity';
import { Advertisers } from './entity/Advertisers.entity';
import { AdminUser } from './entity/AdminUser.entity';
import { AdminService } from './service/admin.service';
import { AdvertiserService } from './service/advertiser.service';
import { AuthorService } from './service/author.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Advertisers, AdminUser])],
  providers: [UserService, AuthorService, AdvertiserService, AdminService],
  exports: [UserService],
})
export class UserModule {}
