import redis from 'redis'

class RoomRepository {
  private inner: redis.RedisClient

  constructor(inner) {
    // DB 0: room list
    this.inner = inner
  }

  add(roomID: string) {
    if(!roomID) return
    return new Promise((resolve, reject) => {
      this.inner.setex(
        roomID,
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
    return new Promise((resolve, reject) => {
      this.inner.get(roomID, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  getExpire(roomID: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.inner.ttl(roomID, (error, reply) => {
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
