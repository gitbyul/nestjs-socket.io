import { IsString, IsOptional, IsJSON } from 'class-validator';
import { Column } from 'typeorm';
import { ChatTemplateNoticeType } from '../enums/chat-template-item-type';

export class SystemMessageDto {
  @IsString()
  @IsOptional()
  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '채팅 템플릿 제목',
  })
  title: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: '채팅 템플릿 내용',
  })
  content: string;

  @IsJSON()
  @IsOptional()
  @Column({
    name: 'notice',
    type: 'json',
    nullable: true,
    comment: '알림/경고/경고문',
  })
  notice?: {
    type: ChatTemplateNoticeType;
    message: string;
  };

  @IsJSON()
  @IsOptional()
  @Column({
    name: 'buttons',
    type: 'json',
    nullable: true,
    comment: '채팅 템플릿 버튼',
  })
  buttons?: {
    btnType?: 'LEFT' | 'RIGHT' | 'FILL';
    text: string;
    url?: string;
  }[];

  @IsJSON()
  @IsOptional()
  @Column({
    name: 'links',
    type: 'json',
    nullable: true,
    comment: '채팅 템플릿 링크',
  })
  links?: { title: string; url: string }[];

  @IsJSON()
  @IsOptional()
  @Column({
    name: 'files',
    type: 'json',
    nullable: true,
    comment: '채팅 템플릿 파일',
  })
  files?: { originalName: string; fileId: string; size: number }[];
}
