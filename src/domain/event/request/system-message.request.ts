import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Column } from 'typeorm';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { SystemMessageDto } from 'src/domain/system-message/dto/system-message.dto';

export class SendSystemMessageRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Column({
    name: 'sender',
    type: 'enum',
    enum: UserRole,
    comment: '발신자 타입',
  })
  senderType: UserRole; // ADVERTISER, AUTHOR

  @IsString()
  @IsOptional()
  @Column({
    name: 'senderId',
    type: 'varchar',
    length: 36,
    nullable: true,
    comment: '발신자 ID',
  })
  senderId: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'chatRoomId',
    type: 'varchar',
    length: 36,
    nullable: true,
    comment: '채팅방 ID',
  })
  chatRoomId: string;

  @IsNotEmpty({ message: '시스템 메시지는 필수 입력 항목입니다.' })
  @IsObject()
  @ValidateNested()
  @Type(() => SystemMessageDto)
  @IsNotEmpty({ message: '시스템 메시지는 필수 입력 항목입니다.' })
  systemMessage: SystemMessageDto;
}
