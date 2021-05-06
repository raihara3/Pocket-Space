import RoomRepositoryMock from '../../../repository/room/__mocks__/RoomRepository.mock'
import CreateRoomService from '../CreateRoomService'

const roomStorage: any = {}

describe('CreateRoomService', () => {
  const roomRepositoryMock = new RoomRepositoryMock(roomStorage)
  const createRoomService = new CreateRoomService(roomRepositoryMock)

  test('execute', async () => {
    await createRoomService.execute()

    expect(roomRepositoryMock.add.call.length).toBe(1)
  })
})
