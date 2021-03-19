import redis from 'redis'

class UserNameRepository {
  inner: redis.RedisClient
  prefix: string

  constructor(inner) {
    // DB 3: member list
    this.inner = inner
    this.prefix = 'user_'
  }

  add(userID: string, userName: string) {
    if(!userID) return
    const key = this.prefix + userID
    return new Promise((resolve, reject) => {
      this.inner.setex(key, 60 * 60 * 24 * 1, userName, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  remove(userID: string) {
    const key = this.prefix + userID
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

export default UserNameRepository
