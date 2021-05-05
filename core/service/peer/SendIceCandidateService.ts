import UserMessagingRepository from '../../repository/user/UserMessagingRepository'

interface PeerIceData {
  targetID: string
  senderID: string
  ice: any
}

class SendIceCandidateService {
  private userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: PeerIceData) {
    if(!Object.keys(data).length) return
    this.userMessagingRepository.to('getIceCandidate', {
      senderID: data.senderID,
      ice: data.ice
    }, data.targetID)
  }
}

export default SendIceCandidateService
