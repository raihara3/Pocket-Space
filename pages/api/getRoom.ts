import redis from 'redis'
import getUrlParams from '../../src/utils/getUrlParams'
import RoomRepository from '../../core/repository/room/RoomRepository'
import GetRoomService from '../../core/service/room/GetRoomService'

const getRoomHandler = async(req, res) => {
  const params: any = getUrlParams(req.headers.referer)
  const roomID = params.room
  if(!roomID) {
    res.status(400).json({message: 'Bad Request'})
    res.end()
    return
  }

  const roomStorage = redis.createClient({
    host: process.env.REDIS_HOST,
    db: 0,
    retry_strategy: options => {
      if(options.total_retry_time > 1000) {
        res.status(503).json({message: 'Service Unavailable'})
        res.end()
        return
      }
      return 1000
    }
  })

  roomStorage.on('connect', async() => {
    const roomRepository = new RoomRepository(roomStorage)
    const { hasRoom, remainingTime } = await new GetRoomService(roomRepository).execute(roomID)
    roomStorage.quit()
    if(!hasRoom) {
      res.status(404).json({message: 'Not Found'})
      res.end()
      return
    }
    res.status(200).json({
      message: 'OK',
      data: {remainingTime: remainingTime}
    })
    res.end()
  })

  roomStorage.on('error', (e) => console.error(e))

}

export const config = {
  api: {
    bodyParser: false
  }
}

export default getRoomHandler
