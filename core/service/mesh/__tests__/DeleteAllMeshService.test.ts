import MeshRepositoryMock from '../../../repository/mesh/__mocks__/MeshRepository.mock'
import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import DeleteAllMeshService from '../DeleteAllMeshService'

const meshStorage: any = {}

const roomID = 'testRoom'

describe('DeleteAllMeshService', () => {
  const meshRepositoryMock = new MeshRepositoryMock(meshStorage)
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const deleteAllMeshService = new DeleteAllMeshService(
    meshRepositoryMock,
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await deleteAllMeshService.execute(roomID)

    expect(meshRepositoryMock.add.call.length).toBe(1)
    expect(userMessagingRepositoryMock.toOther.call.length).toBe(1)
  })
})
