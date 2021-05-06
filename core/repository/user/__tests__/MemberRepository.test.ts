import redis from 'redis-mock'
import MemberRepository from '../MemberRepository'

describe.each([
  {
    roomID: 'testRoom',
    userID: 'user1_id',
    response: {
      list: ['user1_id'],
    },
  },
  {
    roomID: 'testRoom',
    userID: 'user2_id',
    response: {
      list: ['user1_id', 'user2_id'],
    },
  },
])('MemberRepository. (%o)', ({ roomID, userID, response }) => {
  const memberRepository = new MemberRepository(redis.createClient())

  test('add', async () => {
    const res = await memberRepository.add(roomID, userID)
    expect(res).toBe(1)
  })
  test('get list', async () => {
    const res = await memberRepository.list(roomID)
    expect(res).toEqual(response.list)
  })
  test('get list non-existent roomID', async () => {
    const notExistRoomID = 'notExistRoomID'
    const res = await memberRepository.list(notExistRoomID)
    expect(res).toEqual([])
  })
})

describe('MemberRepository', () => {
  const roomID = 'testRoom'
  const userID = 'user_id'
  const memberRepository = new MemberRepository(redis.createClient())

  test('remove', async () => {
    await memberRepository.add(roomID, userID)
    const res = await memberRepository.remove(roomID, userID)
    expect(res).toBe(1)
  })
  test('remove non-existent userID', async () => {
    const notExistUserID = 'notExistUserID'
    const res = await memberRepository.remove(roomID, notExistUserID)
    expect(res).toBe(0)
  })
  test('remove non-existent roomID', async () => {
    const notExistRoomID = 'notExistRoomID'
    const res = await memberRepository.remove(notExistRoomID, userID)
    expect(res).toBe(0)
  })
})
