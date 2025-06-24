import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatTemplateType } from '../enums/chat-template-type';

@Entity({ name: 'chat_templates' })
export class ChatTemplates {
  @PrimaryColumn({ type: 'char', length: 36, comment: 'UUID' })
  id: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatTemplateType,
    comment: '채팅 템플릿 타입',
  })
  type: ChatTemplateType;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '채팅 템플릿 제목',
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: true,
    comment: '채팅 템플릿 내용',
  })
  content?: string;

  @Column({
    name: 'bg_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 배경 색상',
  })
  bgColor?: string;

  @Column({
    name: 'text_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 텍스트 색상',
  })
  textColor?: string;

  @Column({
    name: 'button_color',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '채팅 템플릿 버튼 색상(버튼 타입 일 때만 사용)',
  })
  buttonColor?: string;

  @Column({
    name: 'url',
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: '채팅 템플릿 링크(버튼 타입 일 때만 사용)',
  })
  url?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '수정일' })
  updatedAt: Date;
}
