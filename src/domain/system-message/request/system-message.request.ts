import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ChatTemplateCode } from '../../chat/enums/chat-template-code';

export class SystemMessageRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '채팅방 ID',
    example: '8715c14e-916d-4a39-86af-ed877ffdd801',
  })
  chatRoomId: string;

  @IsEnum(ChatTemplateCode)
  @IsNotEmpty({ message: '템플릿 코드는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '템플릿 코드',
    example: ChatTemplateCode.ADVERTISER_AD_PROPOSAL_MESSAGE,
  })
  templateCode: ChatTemplateCode;

  @ValidateIf(
    (o) => o.templateCode === ChatTemplateCode.AUTHOR_AD_EXECUTION_COMPLETE,
  )
  @IsOptional()
  @ApiProperty({
    description: '링크',
    example: [{ title: '링크 제목', url: 'https://www.naver.com' }],
  })
  links?: { title: string; url: string }[];

  @ValidateIf(
    (o) =>
      o.templateCode ===
        ChatTemplateCode.AUTHOR_AD_CONTI_WORK_CONFIRM_REQUEST ||
      o.templateCode === ChatTemplateCode.AUTHOR_AD_WORK_CONFIRM_REQUEST,
  )
  @IsOptional()
  @ApiProperty({
    description: '파일',
    example: [
      {
        fileId: '02a6788b-40fd-4d9b-b062-e8df3d7d8ef7',
      },
    ],
  })
  filesIdList?: { fileId: string }[];
}
