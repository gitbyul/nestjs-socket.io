export type EventEmitterType = ChatEventEmitter;

export enum ChatEventEmitter {
  SEND_FILE_MESSAGE = 'chat.event.send-file-message',
  SEND_SYSTEM_MESSAGE = 'chat.event.send-system-message',
}
