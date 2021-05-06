import redis from 'redis-mock'
import MeshRepository from '../MeshRepository'

describe.each([
  {
    roomID: 'testRoom1',
    data: { geometry: 'box' },
    response: {
      list: [{ geometry: 'box' }],
    },
  },
  {
    roomID: 'testRoom1',
    data: { geometry: 'box' },
    response: {
      list: [{ geometry: 'box' }, { geometry: 'box' }],
    },
  },
  {
    roomID: 'testRoom2',
    data: { geometry: 'box' },
    response: {
      list: [{ geometry: 'box' }],
    },
  },
])('MeshRepository', ({ roomID, data, response }) => {
  const meshRepository = new MeshRepository(redis.createClient())

  test('add', async () => {
    const res = await meshRepository.add(roomID, JSON.stringify(data))
    expect(res).toBe(1)
  })
  test('list', async () => {
    const res: Array<string> = await meshRepository.list(roomID)
    expect(res.map((item) => JSON.parse(item))).toEqual(response.list)
  })
})

describe('MeshRepository', () => {
  const roomID = 'testRoom'
  const data = { geometry: 'box' }
  const meshRepository = new MeshRepository(redis.createClient())

  test('delete', async () => {
    await meshRepository.add(roomID, JSON.stringify(data))
    const res = await meshRepository.delete(roomID)
    expect(res).toBe(1)
  })
  test('delete non-existent roomID', async () => {
    const notExistRoomID = 'notExistRoomID'
    const res = await meshRepository.delete(notExistRoomID)
    expect(res).toBe(0)
  })
})
