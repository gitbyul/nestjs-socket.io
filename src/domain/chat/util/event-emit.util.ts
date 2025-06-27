import { Socket } from 'socket.io';
import { EventPayloadMap } from '../type/event-payload.map';
import { IChatEventResponse } from '../interface/chat-event-response.interface';
import { EventErrorCode } from '../enums/chat-error-code.enum';

export class EventEmitUtil {
  /**
   * 성공 응답 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param event - 이벤트 타입
   * @param data - 이벤트 데이터
   */
  static emitSuccess<T extends keyof EventPayloadMap>(
    socket: Socket,
    event: T,
    data: EventPayloadMap[T],
  ) {
    const response: IChatEventResponse<T> = {
      success: true,
      event,
      data,
      timestamp: new Date(),
    };

    socket.emit(event, response);
  }

  /**
   * 실패 응답 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param event - 이벤트 타입
   * @param code - 오류 코드
   * @param message - 오류 메시지
   */
  static emitFailed(
    socket: Socket,
    event: keyof EventPayloadMap,
    code: EventErrorCode,
    message: string,
  ) {
    const response: IChatEventResponse<keyof EventPayloadMap> = {
      success: false,
      event,
      error: {
        code,
        message,
      },
      timestamp: new Date(),
    };

    socket.emit(event, response);
  }

  /**
   * 방 내부 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param roomId - 방 ID
   * @param event - 이벤트 타입
   * @param data - 이벤트 데이터
   */
  static emitToRoom(
    socket: Socket,
    roomId: string,
    event: keyof EventPayloadMap,
    data: EventPayloadMap[keyof EventPayloadMap],
  ) {
    const response: IChatEventResponse<keyof EventPayloadMap> = {
      success: true,
      event,
      data,
      timestamp: new Date(),
    };

    socket.to(roomId).emit(event, response);
  }
}
