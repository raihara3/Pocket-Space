import redis from 'redis'

class MemberRepository {
  inner: redis.RedisClient

  constructor(inner) {
    // DB 1: member list
    this.inner = inner
  }

  add(roomID: string, userID: string) {
    return new Promise((resolve, reject) => {
      this.inner.rpush(roomID, userID)
      this.inner.expire(roomID, 60 * 60 * 24 * 1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  list(roomID: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.inner.lrange(roomID, 0, -1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  remove(roomID: string, userID: string) {
    return new Promise((resolve, reject) => {
      this.inner.lrem(roomID, 0, userID, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }
}

export default MemberRepository
