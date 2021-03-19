import redis from 'redis'

class MeshRepository {
  inner: redis.RedisClient
  prefix: string

  constructor(inner) {
    // DB 2: mesh list
    this.inner = inner
    this.prefix = 'mesh_'
  }

  add(roomID: string, data: any) {
    if(!roomID) return
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.rpush(key, data)
      this.inner.expire(key, 60 * 60 * 24 * 1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  list(roomID: string): any {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.lrange(key, 0, -1, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  delete(roomID: string) {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.del(key, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }
}

export default MeshRepository
