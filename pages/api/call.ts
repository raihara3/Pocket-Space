import redis from 'redis'
import { Server } from 'socket.io'
import { createAdapter } from 'socket.io-redis'
import getUrlParams from '../../src/utils/getUrlParams'
import MemberRepository from '../../core/repository/user/MemberRepository'
import UserNameRepository from '../../core/repository/user/UserNameRepository'
import MeshRepository from '../../core/repository/mesh/MeshRepository'
import UserMessagingRepository from '../../core/repository/user/UserMessagingRepository'
import RoomRepository from '../../core/repository/room/RoomRepository'
import AddUserService from '../../core/service/user/AddUserService'
import LeaveUserService from '../../core/service/user/LeaveUserService'
import SendMeshService from '../../core/service/mesh/SendMeshService'
import SendPeerOfferService from '../../core/service/peer/SendPeerOfferService'
import SendPeerAnswerService from '../../core/service/peer/SendPeerAnswerService'
import SendIceCandidateService from '../../core/service/peer/SendIceCandidateService'
import GetRoomService from '../../core/service/room/GetRoomService'

const callHandler = async(req, res) => {
  if(res.socket.server.io) {
    // socket.io is already running
    res.end()
    return
  }

  const params: any = getUrlParams(req.headers.referer)
  const roomID = params.room
  if(!roomID) {
    res.status(400).json({message: 'Bad Request'})
    res.end()
  }

  const roomStorage = redis.createClient({host: process.env.REDIS_HOST, db: 0})
  const memberStorage = redis.createClient({host: process.env.REDIS_HOST, db: 1})
  const meshStorage = redis.createClient({host: process.env.REDIS_HOST, db: 2})
  const userNameStorage = redis.createClient({host: process.env.REDIS_HOST, db: 3})

  const io = new Server(res.socket.server)
  const pubClient = redis.createClient({host: process.env.REDIS_HOST})
  const subClient = pubClient.duplicate()
  io.adapter(createAdapter({ pubClient, subClient }))
  pubClient.on('error', (e) => console.error(e))
  subClient.on('error', (e) => console.error(e))
  io.of('/').adapter.on('error', (e) => console.error(e))

  const roomRepository = new RoomRepository(roomStorage)
  const memberRepository = new MemberRepository(memberStorage)
  const meshRepository = new MeshRepository(meshStorage)
  const userNameRepository = new UserNameRepository(userNameStorage)
  const hasRoom = await new GetRoomService(roomRepository).execute(roomID)
  if(!hasRoom) {
    res.status(404).json({message: 'Not Found'})
    res.end()
  }

  const userName = req.query.name
  io.on('connect', socket => {
    socket.join(roomID)

    const sender = (eventName, data, targetID) => {
      return targetID ? socket.to(targetID).emit(eventName, data) : socket.emit(eventName, data)
    }
    const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
    const userMessagingRepository = new UserMessagingRepository(sender, broadcast)
    new AddUserService(
      memberRepository,
      userNameRepository,
      meshRepository,
      userMessagingRepository
    ).execute(roomID, socket.id, userName)

    socket.on('sendMesh', data =>
      new SendMeshService(meshRepository, userMessagingRepository).execute(roomID, data)
    )

    socket.on('sendPeerOffer', data => {
      new SendPeerOfferService(userMessagingRepository).execute(data)
    })

    socket.on('sendPeerAnswer', data => {
      new SendPeerAnswerService(userMessagingRepository).execute(data)
    })

    socket.on('sendIceCandidate', data => {
      new SendIceCandidateService(userMessagingRepository).execute(data)
    })

    socket.on('disconnect', async() =>{
      new LeaveUserService(
        memberRepository,
        userNameRepository,
        meshRepository,
        userMessagingRepository
      ).execute(roomID, socket.id)
    })
  })
  res.socket.server.io = io
  res.end()

  roomStorage.on('error', (e) => console.error(e))
  memberStorage.on('error', (e) => console.error(e))
  meshStorage.on('error', (e) => console.error(e))
  userNameStorage.on('error', (e) => console.error(e))
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default callHandler
