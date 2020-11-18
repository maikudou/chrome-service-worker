import { ServerMessage, ContentScriptMessage, Message } from './types'

const SOCKET_URL = 'wss://echo.websocket.org'

console.log('I am a worker')

function postMessageToPort(port: chrome.runtime.Port, message: ServerMessage) {
  port.postMessage(JSON.stringify(message))
}

chrome.runtime.onConnect.addListener(port => {
  console.log('New incoming connection', port.name)

  postMessageToPort(port, {
    type: 'welcome',
    message: 'Hey, welcome'
  })

  port.onMessage.addListener(message => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage) {
      processPortMessage(port, parsedMessage as ContentScriptMessage)
    }
  })
})

async function initSocket(port: chrome.runtime.Port) {
  const connection = await new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(SOCKET_URL)
    ws.addEventListener('open', event => {
      resolve(ws)
    })
    ws.addEventListener('error', event => {
      reject(ws)
    })
  })

  connection.addEventListener('message', event => {
    processSocketMessage(port, event.data)
  })

  port.onMessage.addListener(message => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage) {
      processPortSocketMessage(connection, parsedMessage as ContentScriptMessage)
    }
  })
}

function processPortMessage(port: chrome.runtime.Port, message: ContentScriptMessage) {
  if (Message.isPingMessage(message)) {
    postMessageToPort(port, {
      type: 'pong'
    })
  } else if (Message.isStartSessionMessage(message)) {
    initSocket(port)
  } else {
    postMessageToPort(port, {
      type: 'mirror',
      message: `Get it back: ${JSON.stringify(message)}`
    })
  }
}

function processPortSocketMessage(socket: WebSocket, message) {
  if (Message.isSocketSendMessage(message)) {
    socket.send(message.message)
  }
}

function processSocketMessage(port: chrome.runtime.Port, data: any) {
  postMessageToPort(port, {
    type: 'socket',
    data
  })
}
