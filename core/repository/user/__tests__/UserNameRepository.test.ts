import redis from 'redis-mock'
import UserNameRepository from '../UserNameRepository'

const userID = 'test_id'
const userName = 'test_name'

describe('UserNameRepository', () => {
  const userNameRepository = new UserNameRepository(redis.createClient())

  test('add', async () => {
    const res = await userNameRepository.add(userID, userName)
    expect(res).toBe('OK')
  })
  test('remove', async () => {
    const res = await userNameRepository.remove(userID)
    expect(res).toBe(1)
  })
  test('remove non-existent useerID', async () => {
    const notExistRoomID = 'notExistRoomID'
    const res = await userNameRepository.remove(notExistRoomID)
    expect(res).toBe(0)
  })
})
