import { ServerMessage, ContentScriptMessage, Message } from './types'

console.log('I am a content script')

let reconnectsLeft = 5
let lastTimeConnected = Date.now()
let connection: chrome.runtime.Port
let pingTimeout
let socketPingTimeout

const connectToServiceWorker = function() {
  try {
    connection = chrome.runtime.connect({ name: 'sw-connection' })
    connection.onDisconnect.addListener(() => {
      console.log(
        `Worker disconnected. TTL: ${(Date.now() - lastTimeConnected) / 1000}s`,
        `Error: ${chrome.runtime.lastError}`
      )
      if (reconnectsLeft-- >= 0) {
        connectToServiceWorker()
      }
    })
    connection.onMessage.addListener(message => {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage) {
        processPortMessage(parsedMessage as ServerMessage)
      }
    })

    window.setTimeout(() => {
      // not in an endless loop, reset
      reconnectsLeft = 5
    }, 5000)

    console.log('Connected to Service Worker', (Date.now() - lastTimeConnected) / 1000)

    lastTimeConnected = Date.now()
    postMessageToServiceWorker(connection, {
      type: 'startSession'
    })

    socketPing(connection, 1500)
    ping(connection)
  } catch (_) {}
}

// sending ping every 10-20 seconds
function ping(port: chrome.runtime.Port) {
  pingTimeout = window.setTimeout(() => {
    postMessageToServiceWorker(connection, {
      type: 'ping'
    })
    ping(port)
  }, 10000 + Math.random() * 10000)
}

// sending random strings to socket every 30-60 seconds
function socketPing(port: chrome.runtime.Port, timeout?: number) {
  pingTimeout = window.setTimeout(
    () => {
      postMessageToServiceWorker(connection, {
        type: 'socketSend',
        message: `Sorry, current time is ${Date.now()}`
      })
      socketPing(port)
    },
    timeout ? timeout : 30000 + Math.random() * 30000
  )
}

connectToServiceWorker()

function postMessageToServiceWorker(port: chrome.runtime.Port, message: ContentScriptMessage) {
  try {
    port.postMessage(JSON.stringify(message))
  } catch (e) {
    console.log(`Couldn't post message do to error: ${e}`)
    throw e
  }
}

function processPortMessage(message: ServerMessage) {
  if (Message.isMirrorMessage(message)) {
    console.log(`Recieved mirrored message: ${message.message}`)
  } else if (Message.isPongMessage(message)) {
    console.log('Recieved pong message')
  } else if (Message.isSocketMessage(message)) {
    console.log(`Recieved message from socket: ${message.data}`)
  } else if (Message.isWelcomeMessage(message)) {
    console.log('Recieved Welcome message')
  }
}
