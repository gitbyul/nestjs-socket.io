import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import {
  ChatTemplateButtonLocationType,
  ChatTemplateNoticeType,
  ChatTemplateType,
} from '../enums/chat-template-item-type';
import { ChatTemplateCode } from '../enums/chat-template-code';

@Entity({ name: 'chat_templates' })
export class ChatTemplates extends ValidationEntity {
  @PrimaryColumn({ type: 'char', length: 36, comment: 'UUID' })
  id: string;

  @IsEnum(ChatTemplateCode)
  @IsNotEmpty()
  @Column({
    name: 'code',
    type: 'varchar',
    length: 100,
    comment: '채팅 템플릿 코드',
  })
  code: ChatTemplateCode; // 채팅 템플릿 코드

  @IsEnum(ChatTemplateType)
  @IsNotEmpty()
  @Column({
    name: 'type',
    type: 'varchar',
    length: 100,
    comment: '채팅 템플릿 타입',
  })
  type: ChatTemplateType; // TEMPLATE, BUTTON

  @IsString()
  @IsOptional()
  @Column({
    name: 'action_type',
    type: 'varchar',
    length: 100,
    comment: '채팅 템플릿 액션 타입',
  })
  actionType: ChatTemplateNoticeType | ChatTemplateButtonLocationType;

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

  @IsString()
  @IsOptional()
  @Column({
    name: 'url',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: '채팅 템플릿 링크',
  })
  url?: string | null;

  @IsNumber()
  @IsOptional()
  @Column({
    name: 'order',
    type: 'int',
    nullable: true,
    default: 0,
    comment: '순서',
  })
  order: number;

  @IsBoolean()
  @IsNotEmpty()
  @Column({
    name: 'is_link',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '링크 여부',
  })
  isLink: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Column({
    name: 'is_file',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '파일 여부',
  })
  isFile: boolean;

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '수정일' })
  updatedAt: Date;
}
