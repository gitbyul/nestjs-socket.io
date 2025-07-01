import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'original_filename',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '파일 이름',
  })
  originalFilename: string;

  @Column({
    name: 'mimetype',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '파일 타입',
  })
  mimetype: string;

  @Column({
    name: 'size',
    type: 'bigint',
    nullable: true,
    comment: '파일 크기 (바이트)',
  })
  size: number | null;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 500,
    nullable: false,
    comment: '파일 S3 경로',
  })
  path: string;

  @Column({
    name: 'url',
    type: 'varchar',
    length: 1000,
    nullable: false,
    comment: '파일 접근 URL',
  })
  url: string;

  @Column({
    name: 'related_table',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '연관 테이블',
  })
  relatedTable: string | null;

  @Column({
    name: 'related_code',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '연관 코드',
  })
  relatedCode: string | null;

  @Column({
    name: 'related_id',
    type: 'varchar',
    length: 36,
    nullable: true,
    comment: '연관 아이디',
  })
  relatedId: string | null;

  @Column({
    name: 'order_number',
    type: 'int',
    nullable: true,
    comment: '파일 순번',
  })
  orderNumber: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
    comment: '생성일',
  })
  createdAt: Date;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @CreateDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    comment: '삭제일',
  })
  deletedAt: Date | null;

  /**
   * S3에 파일이 저장된 후, 해당 정보를 기반으로 Files 엔티티 인스턴스를 생성합니다.
   * @param params S3 업로드 후 반환된 정보 및 연관 데이터
   */
  static fromS3Upload(params: {
    originalFilename: string;
    mimetype: string;
    size: number | null;
    path: string;
    url: string;
    relatedTable: string;
    relatedCode?: string | null;
    relatedId: string;
    orderNumber?: number | null;
  }): Files {
    const file = new Files();
    file.originalFilename = params.originalFilename;
    file.mimetype = params.mimetype;
    file.size = params.size ?? null;
    file.path = params.path;
    file.url = params.url;
    file.relatedTable = params.relatedTable;
    file.relatedCode = params.relatedCode ?? null;
    file.relatedId = params.relatedId;
    file.orderNumber = params.orderNumber ?? null;
    file.isDeleted = false;

    return file;
  }

  static create(params: {
    originalFilename: string;
    mimetype: string;
    size: number | null;
    path: string;
    url: string;
    relatedTable?: string | null;
    relatedCode?: string | null;
    relatedId?: string | null;
    orderNumber?: number | null;
    isDeleted?: boolean;
  }): Files {
    const file = new Files();
    file.originalFilename = params.originalFilename;
    file.mimetype = params.mimetype;
    file.size = params.size ?? null;
    file.path = params.path;
    file.url = params.url;
    file.relatedTable = params.relatedTable ?? null;
    file.relatedCode = params.relatedCode ?? null;
    file.relatedId = params.relatedId ?? null;
    file.orderNumber = params.orderNumber ?? null;
    file.createdAt = new Date();
    file.isDeleted = params.isDeleted ?? false;
    file.deletedAt = params.isDeleted ? new Date() : null;
    return file;
  }
}
