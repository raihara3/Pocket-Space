import io from 'socket.io-client'
import http from 'http'
import { Server, Socket } from 'socket.io'
import UserMessagingRepository from '../UserMessagingRepository'

let httpServer: any
let httpServerAddress: any
let ioServer: Server
let otherClient: SocketIOClient.Socket
let myClient: SocketIOClient.Socket
let socket: Socket
const memberList: Array<string> = []

beforeAll((done) => {
  httpServer = http.createServer().listen()
  httpServerAddress = httpServer.address()
  ioServer = new Server(httpServer)
  ioServer.on('connect', (iosocket) => {
    socket = iosocket
    memberList.push(iosocket.id)
  })
  done()
})
afterAll((done) => {
  ioServer.close()
  httpServer.close()
  done()
})
beforeEach((done) => {
  const uri = `http://[${httpServerAddress.address}]:${httpServerAddress.port}`
  const option = {
    forceNew: true,
    transports: ['websocket'],
  }
  memberList.length = 0
  otherClient = io(uri, option)
  otherClient.on('connect', () => done())
  myClient = io(uri, option)
  myClient.on('connect', () => done())
})
afterEach((done) => {
  if (otherClient.connected) {
    otherClient.disconnect()
  }
  if (myClient.connected) {
    myClient.disconnect()
  }
  done()
})
describe('UserMessagingRepository', () => {
  const sender = (eventName, data, targetID) => {
    return targetID
      ? socket.to(targetID).emit(eventName, data)
      : socket.emit(eventName, data)
  }
  const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
  const userMessagingRepository = new UserMessagingRepository(sender, broadcast)

  test('toAll', (done) => {
    userMessagingRepository.toAll('toAll', 'toAll')

    otherClient.on('toAll', (data) => {
      expect(data).toBe('toAll')
    })
    myClient.on('toAll', (data) => {
      expect(data).toBe('toAll')
      done()
    })
  })

  test('toOther', (done) => {
    userMessagingRepository.toOther('toOther', 'toOther')

    otherClient.on('toOther', (data) => {
      expect(data).toBe('toOther')
      done()
    })
  })

  test('toSender', (done) => {
    userMessagingRepository.toSender('toSender', 'messaging')

    myClient.on('toSender', (data) => {
      expect(data).toBe('messaging')
      done()
    })
  })

  test('toTarget', (done) => {
    userMessagingRepository.to('toTarget', 'toTarget', memberList[0])

    otherClient.on('toTarget', (data) => {
      expect(data).toBe('toTarget')
      done()
    })
  })
})
