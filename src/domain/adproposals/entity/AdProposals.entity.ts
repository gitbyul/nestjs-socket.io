import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { Author } from 'src/domain/user/entity/Author.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdProposalStatus } from '../enums/ad-proposal-status.enum';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { AdProposalAuthorWorkStatus } from '../enums/ad-proposal-author-work-status.enum copy';

@Entity('ad_proposals')
export class AdProposals {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  // 광고주 관련
  @Column({
    name: 'advertiser_id',
    type: 'char',
    length: 36,
    comment: '광고주 ID (FK)',
  })
  advertiserId: string;
  @ManyToOne(() => Advertisers, { nullable: false })
  @JoinColumn({ name: 'advertiser_id' })
  advertiser: Advertisers;

  // 작가 관련
  @Column({
    name: 'author_id',
    type: 'char',
    length: 36,
    comment: '작가 ID (FK)',
  })
  authorId: string;
  @ManyToOne(() => Author, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  // 광고 제안서 홍보 요청 URL
  @Column({
    name: 'promotion_request_url',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '광고 제안서 홍보 요청 URL',
  })
  promotionRequestUrl: string | null;

  // 광고 제안서 관련
  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '광고 제안 제목',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
    comment: '광고 제안 설명',
  })
  description: string;

  @Column({
    name: 'detail_description',
    type: 'text',
    comment: '광고 제안 상세 설명',
  })
  detailDescription: string;

  @Column({
    name: 'price',
    type: 'bigint',
    default: 0,
    comment: '광고 제안 가격',
  })
  price: number;

  @Column({
    name: 'price_negotiation_status',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '광고 제안 가격 협의 후 결정 유무',
  })
  priceNegotiationStatus: boolean;

  @Column({
    name: 'artwork_revision_limit',
    type: 'int',
    nullable: false,
    default: 0,
    comment: '광고주가 작가에게 요청할 수 있는 실작업물 수정요청 제한 횟수',
  })
  artworkRevisionLimit: number;

  // 광고 제안 상태 관련
  @Column({
    name: 'ad_proposal_status',
    type: 'enum',
    nullable: false,
    enum: AdProposalStatus,
    default: AdProposalStatus.PROPOSED,
    comment: '광고 제안 상태',
  })
  adProposalStatus: AdProposalStatus;

  @Column({
    name: 'ad_proposal_status_updated_by_type',
    type: 'enum',
    nullable: false,
    enum: UserRole,
    default: UserRole.ADVERTISER,
    comment: '광고 제안 상태 수정자 타입(광고주/작가/관리자)',
  })
  adProposalStatusUpdatedByType: UserRole;

  @Column({
    name: 'ad_proposal_status_updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '광고 제안 상태 수정일시',
  })
  adProposalStatusUpdatedAt: Date;

  @Column({
    name: 'ad_proposal_status_updated_by',
    type: 'uuid',
    nullable: false,
    comment: '광고 제안 상태 수정자(광고주/작가/관리자)',
  })
  adProposalStatusUpdatedBy: string;

  @Column({
    name: 'contract_signed_at',
    type: 'timestamp',
    nullable: true,
    comment: '계약 체결일시',
  })
  contractSignedAt: Date | null;

  // 작가 작업 상태 관련
  @Column({
    name: 'author_work_status',
    type: 'enum',
    nullable: true,
    enum: AdProposalAuthorWorkStatus,
    comment: '작가 작업 상태',
  })
  authorWorkStatus: AdProposalAuthorWorkStatus | null;

  @Column({
    name: 'author_status_updated_at',
    type: 'timestamp',
    nullable: true,
    comment: '작가 상태 수정일시',
  })
  authorStatusUpdatedAt: Date | null;

  @Column({
    name: 'author_ad_execution_at',
    type: 'timestamp',
    nullable: true,
    comment: '작가 광고 집행일시',
  })
  authorAdExecutionAt: Date | null;

  // 중재요청 관련
  @Column({
    name: 'mediation_requested',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '중재요청 플래그',
  })
  mediationRequested: boolean;

  @Column({
    name: 'mediation_requested_reason',
    type: 'text',
    nullable: true,
    comment: '중재요청/취소 사유',
  })
  mediationRequestedReason: string | null;

  @Column({
    name: 'mediation_requested_by_type',
    type: 'enum',
    nullable: true,
    enum: UserRole,
    comment: '중재요청자 타입(광고주/작가/관리자)',
  })
  mediationRequestedByType: UserRole | null;

  @Column({
    name: 'mediation_requested_by',
    type: 'uuid',
    nullable: true,
    comment: '중재요청자 ID',
  })
  mediationRequestedBy: string | null;

  @Column({
    name: 'mediation_requested_at',
    type: 'timestamp',
    nullable: true,
    comment: '중재요청일시',
  })
  mediationRequestedAt: Date | null;

  // 관리자 메모
  @Column({
    name: 'admin_memo',
    type: 'text',
    nullable: true,
    comment: '관리자 메모',
  })
  adminMemo: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    comment: '생성일시',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    comment: '수정일시',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: '삭제일시',
  })
  deletedAt: Date | null;
}
