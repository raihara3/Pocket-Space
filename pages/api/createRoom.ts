import redis from 'redis'
import RoomRepository from '../../core/repository/room/RoomRepository'
import CreateRoomService from '../../core/service/room/CreateRoomService'

const createRoomHandler = async (_, res) => {
  const roomStorage = redis.createClient({
    host: process.env.REDIS_HOST,
    db: 0,
    password: process.env.REDIS_PASS,
    port: Number(process.env.REDIS_PORT),
    retry_strategy: (options) => {
      if (options.total_retry_time > 1000) {
        res.status(503).json({ message: 'Service Unavailable' })
        res.end()
        return
      }
      return 1000
    },
  })

  roomStorage.on('connect', async () => {
    const roomRepository = new RoomRepository(roomStorage)
    const room = await new CreateRoomService(roomRepository).execute()
    roomStorage.quit()

    if (room instanceof Error) {
      res.status(503).json({ message: 'Service Unavailable' })
      res.end()
      return
    }
    res.status(200).json({
      message: 'OK',
      data: { roomID: room },
    })
    res.end()
  })
  roomStorage.on('error', (e) => console.error(e))
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default createRoomHandler
