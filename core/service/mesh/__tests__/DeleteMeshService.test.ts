import MeshRepositoryMock from '../../../repository/mesh/__mocks__/MeshRepository.mock'
import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import DeleteMeshService from '../DeleteMeshService'

const meshStorage: any = {}

const roomID = 'testRoom'
const meshName = 'testMesh'

describe('DeleteMeshService', () => {
  const meshRepositoryMock = new MeshRepositoryMock(meshStorage)
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const deleteMeshService = new DeleteMeshService(
    meshRepositoryMock,
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await deleteMeshService.execute(roomID, meshName)

    expect(meshRepositoryMock.add.call.length).toBe(1)
    expect(userMessagingRepositoryMock.toOther.call.length).toBe(1)
  })
})
