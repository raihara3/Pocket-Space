import RoomRepositoryMock from '../../../repository/room/__mocks__/RoomRepository.mock'
import GetRoomService from '../GetRoomService'

const roomStorage: any = {}
const roomID = 'testRoom'

describe('CreateRoomService', () => {
  const roomRepositoryMock = new RoomRepositoryMock(roomStorage)
  const getRoomService = new GetRoomService(roomRepositoryMock)

  test('execute', async () => {
    await getRoomService.get(roomID)

    expect(roomRepositoryMock.get.call.length).toBe(1)
  })
})
