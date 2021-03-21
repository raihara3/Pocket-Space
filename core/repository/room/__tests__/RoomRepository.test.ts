import redis from 'redis-mock'
import RoomRepository from '../RoomRepository'

describe('RoomRepository', () => {
  const roomID = 'testRoom'
  const roomRepository = new RoomRepository(redis.createClient())

  test('add', async() => {
    const res = await roomRepository.add(roomID)
    expect(res).toBe('OK')
  })

  test('get', async() => {
    const res = await roomRepository.get(roomID)
    const date = new Date().toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}).toString()
    expect(res).toBe(date)
  })

  test('get by non-existent key', async() => {
    const notExistRoomID = 'notExist'
    const res = await roomRepository.get(notExistRoomID)
    expect(res).toBe(null)
  })

  test('getExpire', async() => {
    const res = await roomRepository.getExpire(roomID)
    expect(Math.floor(res / (60*60))).toBe(23)
  })

  test('getExpire by non-existent key', async() => {
    const notExistRoomID = 'notExist'
    const res = await roomRepository.get(notExistRoomID)
    expect(res).toBe(null)
  })
})