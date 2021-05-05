import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class DeleteAllMeshService {
  private meshRepository: MeshRepository
  private userMessagingRepository: UserMessagingRepository

  constructor(meshRepository, userMessagingRepository) {
    this.meshRepository = meshRepository
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string) {
    await this.meshRepository.delete(roomID)
    this.userMessagingRepository.toAll('deleteAllMesh', null)
  }
}

export default DeleteAllMeshService
