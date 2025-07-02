import { Injectable } from '@nestjs/common';
import { Files } from '../entity/Files.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRelatedTable } from '../enums/file-releated-table.enums';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files)
    private readonly fileRepository: Repository<Files>,
  ) {}

  async save(file: Files) {
    return await this.fileRepository.save(file);
  }

  async updateFileWithTransaction(
    manager: EntityManager,
    dto: { fileId: string; relatedId: string },
  ) {
    return await manager.update(Files, dto.fileId, {
      relatedId: dto.relatedId,
    });
  }

  /**
   * 파일 조회
   * @param fileId 파일 ID
   * @returns 파일 정보
   */
  async getFile(dto: { fileId: string }) {
    return await this.fileRepository.findOne({
      where: {
        id: dto.fileId,
      },
    });
  }
  async getFileWithTransaction(
    manager: EntityManager,
    dto: { fileId: string },
  ) {
    return await manager.findOne(Files, {
      where: {
        id: dto.fileId,
      },
    });
  }

  /**
   * 특정 chat message와 연결된 파일들을 조회합니다.
   * @param chatMessageId chat message ID
   * @returns 연결된 파일 목록
   */
  async getFilesByChatMessage(dto: {
    chatMessageId: string;
  }): Promise<Files[]> {
    return await this.fileRepository.find({
      where: {
        relatedTable: FileRelatedTable.CHAT,
        relatedId: dto.chatMessageId,
        isDeleted: false,
      },
      order: {
        orderNumber: 'ASC',
      },
    });
  }
  async getFilesByChatMessageWithTransaction(
    manager: EntityManager,
    dto: { chatMessageId: string },
  ): Promise<Files[]> {
    return await manager.find(Files, {
      where: {
        relatedTable: FileRelatedTable.CHAT,
        relatedId: dto.chatMessageId,
        isDeleted: false,
      },
      order: {
        orderNumber: 'ASC',
      },
    });
  }

  /**
   * chat message와 연결된 파일을 생성합니다.
   * @param params 파일 생성 파라미터
   * @returns 생성된 파일
   */
  async createChatMessageFile(params: {
    originalFilename: string;
    mimetype: string;
    size: number | null;
    path: string;
    url: string;
    chatMessageId?: string | null;
    orderNumber?: number | null;
  }): Promise<Files> {
    const file = Files.newChatMessageFile({
      ...params,
    });

    return await this.fileRepository.save(file);
  }
  async createChatMessageFileWithTransaction(
    manager: EntityManager,
    params: {
      originalFilename: string;
      mimetype: string;
      size: number | null;
      path: string;
      url: string;
      chatMessageId: string;
      orderNumber?: number | null;
    },
  ): Promise<Files> {
    const file = Files.newChatMessageFile({
      ...params,
    });

    return await manager.save(Files, file);
  }
}
