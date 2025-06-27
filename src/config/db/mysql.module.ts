import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatConnectedUsers } from 'src/domain/chat/entity/ChatConnectedUsers.entity';
import { ChatMessages } from 'src/domain/chat/entity/ChatMessages.entity';
import { ChatRoomMembers } from 'src/domain/chat/entity/ChatRoomMembers.entity';
import { ChatRooms } from 'src/domain/chat/entity/ChatRooms.entity';
import { ChatTemplates } from 'src/domain/chat/entity/ChatTemplates.entity';
import { AdminUser } from 'src/domain/user/entity/AdminUser.entity';
import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { Author } from 'src/domain/user/entity/Author.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: false,
        logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
        entities: [
          ChatRooms,
          ChatMessages,
          ChatRoomMembers,
          ChatTemplates,
          ChatConnectedUsers,
          Author,
          Advertisers,
          AdminUser,
        ],
      }),
    }),
  ],
})
export class MySqlModule {}
