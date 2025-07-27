import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AdvertisersStatus } from '../enums/advertiser-status.enum';

@Entity('advertisers')
export class Advertisers {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 30,
    comment: '사용자 인증/인가에 사용하는 ID',
  })
  userId: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 100,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    length: 255,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    name: 'contact_name',
    type: 'varchar',
    nullable: false,
    length: 50,
    comment: '담당자명',
  })
  contactName: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: '연락처',
  })
  phoneNumber: string;

  @Column({
    name: 'biz_no',
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: '사업자등록번호',
  })
  bizNo: string;

  @Column({
    name: 'biz_name',
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: '사업자명',
  })
  bizName: string;

  @Column({
    name: 'biz_img_url',
    type: 'varchar',
    nullable: true,
    length: 500,
    comment: '사업자등록증 이미지 URL',
  })
  bizImgUrl: string;

  @Column({
    name: 'profile_img_url',
    type: 'varchar',
    nullable: true,
    length: 500,
    comment: '프로필 이미지 URL',
  })
  profileImgUrl: string;

  @Column({
    name: 'status',
    type: 'enum',
    nullable: false,
    enum: AdvertisersStatus,
    comment: '계정 상태',
  })
  status: AdvertisersStatus;

  @Column({
    name: 'agreed_marketing',
    type: 'tinyint',
    nullable: false,
    default: false,
    comment: '마케팅 동의 여부',
  })
  agreedMarketing: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    comment: '생성일시',
  })
  createdAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: '삭제일시',
  })
  deletedAt: Date;

  @Column({
    name: 'last_updated_at',
    type: 'timestamp',
    nullable: true,
    comment: '최종수정일시',
  })
  lastUpdatedAt: Date | null;

  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    nullable: true,
    comment: '최종로그인일시',
  })
  lastLoginAt: Date | null;
}
