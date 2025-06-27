import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendMessageRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  chatRoomId: string;

  @IsString()
  @IsNotEmpty({ message: '메시지는 필수 입력 항목입니다.' })
  @MinLength(1, { message: '메시지는 1자 이상이어야 합니다.' })
  @MaxLength(1000, { message: '메시지는 1000자 이하여야 합니다.' })
  message: string;

  @IsUUID(4)
  @IsOptional()
  templateId?: string;
}
