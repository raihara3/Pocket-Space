import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class SendMeshService {
  private meshRepository: MeshRepository
  private userMessagingRepository: UserMessagingRepository

  constructor(meshRepository, userMessagingRepository) {
    this.meshRepository = meshRepository
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, data: any) {
    if (!Object.keys(data).length) return
    await this.meshRepository.add(roomID, JSON.stringify(data))
    this.userMessagingRepository.toOther('getMesh', [data])
  }
}

export default SendMeshService
