import MeshRepositoryMock from '../../../repository/mesh/__mocks__/MeshRepository.mock'
import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import SendMeshService from '../SendMeshService'

const meshStorage: any = {}

const roomID = 'testRoom'
const data = {
  data: 'testdata',
}

describe('SendMeshService', () => {
  const meshRepositoryMock = new MeshRepositoryMock(meshStorage)
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const sendMeshService = new SendMeshService(
    meshRepositoryMock,
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await sendMeshService.execute(roomID, data)

    expect(meshRepositoryMock.add.call.length).toBe(1)
    expect(userMessagingRepositoryMock.toOther.call.length).toBe(1)
  })
  test('If the data is empty', async () => {
    await sendMeshService.execute(roomID, {})

    expect(meshRepositoryMock.add.call.length).toBe(1)
  })
})
