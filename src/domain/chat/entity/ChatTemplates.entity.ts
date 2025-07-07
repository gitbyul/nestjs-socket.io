import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import {
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
  actionType: ChatTemplateNoticeType;

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

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '수정일' })
  updatedAt: Date;
}
