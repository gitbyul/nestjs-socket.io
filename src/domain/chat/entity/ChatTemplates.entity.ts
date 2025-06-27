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

import { ChatTemplateType } from '../enums/chat-template-type';

import { ValidationEntity } from 'src/config/entity/Validation.entity';

@Entity({ name: 'chat_templates' })
export class ChatTemplates extends ValidationEntity {
  @PrimaryColumn({ type: 'char', length: 36, comment: 'UUID' })
  id: string;

  @IsEnum(ChatTemplateType)
  @IsNotEmpty()
  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatTemplateType,
    comment: '채팅 템플릿 타입',
  })
  type: ChatTemplateType;

  @IsString()
  @IsOptional()
  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '채팅 템플릿 제목',
  })
  title: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'content',
    type: 'text',
    nullable: true,
    comment: '채팅 템플릿 내용',
  })
  content?: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'bg_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 배경 색상',
  })
  bgColor?: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'text_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 텍스트 색상',
  })
  textColor?: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'button_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 버튼 색상(버튼 타입 일 때만 사용)',
  })
  buttonColor?: string;

  @IsString()
  @IsOptional()
  @Column({
    name: 'url',
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: '채팅 템플릿 링크(버튼 타입 일 때만 사용)',
  })
  url?: string;

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '수정일' })
  updatedAt: Date;
}
