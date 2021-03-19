import redis from 'redis'

class MemberRepository {
  inner: redis.RedisClient
  prefix: string

  constructor(inner) {
    // DB 1: member list
    this.inner = inner
    this.prefix = 'members_'
  }

  add(roomID: string, userID: string) {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.rpush(key, userID)
      this.inner.expire(key, 60 * 60 * 24 * 1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  list(roomID: string): Promise<Array<string>> {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.lrange(key, 0, -1, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  remove(roomID: string, userID: string) {
    const key = this.prefix + roomID
    return new Promise((resolve, reject) => {
      this.inner.lrem(key, 0, userID, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }
}

export default MemberRepository
