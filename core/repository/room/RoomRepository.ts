import redis from 'redis'

class RoomRepository {
  inner: redis.RedisClient
  prefix: string

  constructor(inner) {
    // DB 0: room list
    this.inner = inner
    this.prefix = 'room_'
  }

  add(roomID: string) {
    if(!roomID) return
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.setex(
        key,
        60 * 60 * 24 * 1,
        new Date().toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo"
        }),
        (error, reply) => {
          if(error) {
            reject(error)
          }
          resolve(reply)
        }
      )
    })
  }

  get(roomID: string) {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.get(key, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  getExpire(roomID: string): Promise<number> {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.ttl(key, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }
}

export default RoomRepository
