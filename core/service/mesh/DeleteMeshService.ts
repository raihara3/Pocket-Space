import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class DeleteAllMeshService {
  private meshRepository: MeshRepository
  private userMessagingRepository: UserMessagingRepository

  constructor(meshRepository, userMessagingRepository) {
    this.meshRepository = meshRepository
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, meshName: string) {
    const meshList = await this.meshRepository.list(roomID)
    const newMeshList = meshList.filter(
      (mesh) => JSON.parse(mesh).name !== meshName
    )
    await this.meshRepository.add(roomID, JSON.stringify(newMeshList))
    this.userMessagingRepository.toOther('deleteMesh', meshName)
  }
}

export default DeleteAllMeshService
