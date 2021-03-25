import redis from 'redis'

class MeshRepository {
  inner: redis.RedisClient

  constructor(inner) {
    // DB 2: mesh list
    this.inner = inner
  }

  add(roomID: string, data: any) {
    if(!roomID) return
    return new Promise((resolve, reject) => {
      this.inner.rpush(roomID, data)
      this.inner.expire(roomID, 60 * 60 * 24 * 1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  list(roomID: string): any {
    return new Promise((resolve, reject) => {
      this.inner.lrange(roomID, 0, -1, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  delete(roomID: string) {
    return new Promise((resolve, reject) => {
      this.inner.del(roomID, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }
}

export default MeshRepository
