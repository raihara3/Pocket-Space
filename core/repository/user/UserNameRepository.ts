import redis from 'redis'

class UserNameRepository {
  inner: redis.RedisClient

  constructor(inner) {
    // DB 3: member list
    this.inner = inner
  }

  add(userID: string, userName: string) {
    return new Promise((resolve, reject) => {
      this.inner.setex(userID, 60 * 60 * 24 * 3, userName, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }

  remove(userID: string) {
    return new Promise((resolve, reject) => {
      this.inner.del(userID, (error, reply) => {
        if(error) {
          reject(error)
        }
        resolve(reply)
      })
    })
  }
}

export default UserNameRepository
