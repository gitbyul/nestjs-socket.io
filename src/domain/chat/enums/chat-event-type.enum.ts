export type EventType =
  | EventConnection
  | EventHeartBeat
  | EventChatRoom
  | EventMessage;

export enum EventConnection {
  CONNECTION_ESTABLISHED = 'connection_established',
  CONNECTION_FAILED = 'connection_failed',
  DISCONNECTED = 'disconnected',
}

export enum EventHeartBeat {
  HEARTBEAT = 'heartbeat',
  HEARTBEAT_SUCCESS = 'heartbeat_success',
  HEARTBEAT_FAILED = 'heartbeat_failed',
}

export enum EventChatRoom {
  GET_CHAT_ROOMS = 'get_chat_rooms',
  GET_CHAT_ROOMS_SUCCESS = 'get_chat_rooms_success',
  GET_CHAT_ROOMS_FAILED = 'get_chat_rooms_failed',
}

export enum EventMessage {
  SEND_MESSAGE = 'send_message',
  NEW_MESSAGE = 'new_message',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_FAILED = 'message_failed',
}
