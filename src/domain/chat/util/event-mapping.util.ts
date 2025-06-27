import {
  EventChatRoom,
  EventConnection,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';
import { EventFailEventMap } from '../type/event-fail-event.map';
import { HandlerEventMap } from '../type/handler-event.map';

export class EventMappingUtil {
  // 핸들러 이름 -> 이벤트 이름 매핑
  private static readonly HANDLER_TO_EVENT_MAPPING: HandlerEventMap = {
    heartbeat: EventHeartBeat.HEARTBEAT,
    getChatRooms: EventChatRoom.GET_CHAT_ROOMS,
    sendMessage: EventMessage.SEND_MESSAGE,
  };

  // 이벤트 이름 → 실패 이벤트 매핑
  private static readonly EVENT_TO_FAIL_EVENT_MAPPING: EventFailEventMap = {
    [EventConnection.CONNECTION_ESTABLISHED]: EventConnection.CONNECTION_FAILED,
    [EventHeartBeat.HEARTBEAT]: EventHeartBeat.HEARTBEAT_FAILED,
    [EventChatRoom.GET_CHAT_ROOMS]: EventChatRoom.GET_CHAT_ROOMS_FAILED,
    [EventMessage.SEND_MESSAGE]: EventMessage.MESSAGE_FAILED,
  };

  /**
   * 핸들러 이름으로 이벤트 이름 조회
   * @param handlerName - 핸들러 이름
   * @returns 이벤트 이름
   */
  static getEventName(
    handlerName: keyof HandlerEventMap,
  ): HandlerEventMap[keyof HandlerEventMap] {
    return this.HANDLER_TO_EVENT_MAPPING[handlerName];
  }

  /**
   * 이벤트 이름으로 실패 이벤트 조회
   * @param eventName - 이벤트 이름
   * @returns 실패 이벤트 이름
   */
  static getFailureEvent(
    eventName: keyof EventFailEventMap,
  ): EventFailEventMap[keyof EventFailEventMap] {
    return this.EVENT_TO_FAIL_EVENT_MAPPING[eventName];
  }

  /**
   * 핸들러 이름으로 실패 이벤트 조회
   * @param handlerName - 핸들러 이름
   * @returns 실패 이벤트 이름
   */
  static getFailureEventByHandler(
    handlerName: keyof HandlerEventMap,
  ): EventFailEventMap[keyof EventFailEventMap] {
    const eventName = this.getEventName(handlerName);
    return this.getFailureEvent(eventName);
  }
}
