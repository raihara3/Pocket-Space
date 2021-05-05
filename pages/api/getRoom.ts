import redis from 'redis'
import RoomRepository from '../../core/repository/room/RoomRepository'
import GetRoomService from '../../core/service/room/GetRoomService'

const getRoomHandler = async(req, res) => {
  const requestUrl = req.headers.referer
  const roomID = new URLSearchParams(requestUrl.slice(requestUrl.indexOf('?')))
    .get('room')
  if(!roomID) {
    res.status(400).json({message: 'Bad Request'})
    res.end()
    return
  }

  const roomStorage = redis.createClient({
    host: process.env.REDIS_HOST,
    db: 0,
    password: process.env.REDIS_PASS,
    port: Number(process.env.REDIS_PORT),
    retry_strategy: options => {
      if(options.total_retry_time > 1000) {
        res.status(503).json({message: 'Service Unavailable'})
        res.end()
        return
      }
      return 1000
    }
  })

  roomStorage.on('error', (e) => console.error(e))

  await new Promise((resolve, reject) => {
    roomStorage.on('connect', async() => {
      const getRoomService = new GetRoomService(new RoomRepository(roomStorage))
      const hasRoom = await getRoomService.get(roomID)
      if(!hasRoom) {
        roomStorage.quit()
        reject()
        return
      }
      const remainingTime = await getRoomService.getRemainingTime(roomID)
      roomStorage.quit()
      resolve(remainingTime)
    })
  }).then((remainingTime) => {
    res.status(200).json({
      message: 'OK',
      data: {remainingTime: remainingTime}
    })
    res.end()
  }).catch(() => {
    res.status(404).json({message: 'Not Found'})
    res.end()
  })
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default getRoomHandler
