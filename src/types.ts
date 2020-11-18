export interface Message {
  type: string
}

export interface WelcomeMessage extends Message {
  type: 'welcome'
  message: string
}

export interface PongMessage extends Message {
  type: 'pong'
}

export interface SocketMessage extends Message {
  type: 'socket'
  data: any
}

export interface MirrorMessage extends Message {
  type: 'mirror'
  message: any
}

export type ServerMessage = WelcomeMessage | PongMessage | SocketMessage | MirrorMessage

export interface StartSessionMessage extends Message {
  type: 'startSession'
}

export interface PingMessage extends Message {
  type: 'ping'
}

export interface SocketSendMessage extends Message {
  type: 'socketSend'
  message: string
}

export type ContentScriptMessage = StartSessionMessage | PingMessage | SocketSendMessage

export namespace Message {
  export function isWelcomeMessage(message: ServerMessage): message is WelcomeMessage {
    return message.type === 'welcome'
  }
  export function isPongMessage(message: ServerMessage): message is PongMessage {
    return message.type === 'pong'
  }
  export function isSocketMessage(message: ServerMessage): message is SocketMessage {
    return message.type === 'socket'
  }
  export function isMirrorMessage(message: ServerMessage): message is MirrorMessage {
    return message.type === 'mirror'
  }

  export function isStartSessionMessage(
    message: ContentScriptMessage
  ): message is StartSessionMessage {
    return message.type === 'startSession'
  }
  export function isPingMessage(message: ContentScriptMessage): message is PingMessage {
    return message.type === 'ping'
  }
  export function isSocketSendMessage(message: ContentScriptMessage): message is SocketSendMessage {
    return message.type === 'socketSend'
  }
}
