import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export declare type Sns = {
  snsType: 'YOUTUBE' | 'X' | 'FACEBOOK' | 'NAVERBLOG' | 'POSTYPE' | 'BLOG';
  snsKey: string;
  snsLink: string;
};

@Entity('author')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'timestamp' })
  createdDateTime: Date;
  @Column({ type: 'varchar' })
  snsType: string;
  @Column({ type: 'varchar' })
  snsKey: string;
  @Column({ type: 'varchar' })
  snsLink: string;
  @Column({ type: 'varchar' })
  contact: string;
  @Column({ type: 'varchar' })
  status: string;
  @Column({ type: 'varchar' })
  email: string;
  @Column({ type: 'varchar' })
  nickName: string;
  @Column({ type: 'timestamp' })
  deletedDateTime: Date;
  @Column({ type: 'timestamp' })
  lastUpdatedDateTime: Date | null;
  @Column({ type: 'varchar' })
  tags: string | null;
  @Column({ type: 'varchar' })
  sns: string | null;
  @Column({ type: 'int' })
  subscriptions: number;
  @Column({ type: 'int' })
  likes: number;
  @Column({ type: 'varchar' })
  description: string;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'int' })
  works: number;
  @Column({ type: 'varchar' })
  notice: string;
  @Column({ type: 'varchar' })
  shopLink: string;
  @Column({ type: 'varchar' })
  adKeyIos: string;
  @Column({ type: 'varchar' })
  adKeyAndroid: string;
  @Column({ type: 'varchar' })
  accountBankCode: string;
  @Column({ type: 'varchar' })
  accountNumber: string;
  @Column({ type: 'varchar' })
  accountName: string;
  @Column({ type: 'varchar' })
  thumbnail?: string;
  @Column({ type: 'varchar' })
  profileImage?: string;
  @Column({ type: 'varchar' })
  wideThumbnail?: string;
  @Column({ type: 'varchar' })
  bizNo?: string;
  @Column({ type: 'varchar' })
  bizName?: string;
  @Column({ type: 'varchar' })
  personalNo?: string;
  @Column({ type: 'varchar' })
  personalName?: string;
  @Column({ type: 'varchar' })
  personalIssueDate?: string;
  @Column({ type: 'tinyint' })
  isPersonal: boolean;
  @Column({ type: 'tinyint' })
  agreedMarketingYn: boolean;
  @Column({ type: 'decimal' })
  score: number;
  @Column({ type: 'tinyint' })
  useWorkRecommendationYn: boolean;
  @Column({ type: 'varchar' })
  workRecommendationDays: string;
  @Column({ type: 'tinyint' })
  workRecommendationHour: number;
  @Column({ type: 'timestamp' })
  lastLoginDateTime: Date;
  @Column({ type: 'varchar' })
  mdPickDescription: string;
  @Column({ type: 'timestamp' })
  lastMdPickDateTime: Date | null;

  @Column({
    name: 'service_thumbnail_url',
    type: 'varchar',
    comment: '서비스 썸네일 URL',
  })
  serviceThumbnailUrl: string;
  @Column({
    name: 'service_price_min',
    type: 'int',
    nullable: true,
    comment: '서비스 단가 최소',
  })
  servicePriceMin: number | null;
  @Column({
    name: 'service_price_max',
    type: 'int',
    nullable: true,
    comment: '서비스 단가 최대',
  })
  servicePriceMax: number | null;
  @Column({ name: 'service_text', type: 'text', comment: '서비스 소개' })
  serviceText: string;
  @Column({
    name: 'service_extra',
    type: 'json',
    nullable: true,
    comment: '부가 서비스',
  })
  serviceExtra: { title: string; description: string; price: number }[] | null;
}
