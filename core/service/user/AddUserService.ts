import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import MemberRepository from '../../repository/user/MemberRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'
import UserNameRepository from '../../repository/user/UserNameRepository'

class AddUserService {
  memberRepository: MemberRepository
  userNameRepository: UserNameRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(memberRepository, userNameRepository, mr, userMessagingRepository) {
    this.memberRepository = memberRepository
    this.userNameRepository = userNameRepository
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, newEntryID: string, userName: string) {
    await this.userNameRepository.add(newEntryID, userName)
    await this.memberRepository.add(roomID, newEntryID)
    const memberList = await this.memberRepository.list(roomID)

    this.userMessagingRepository.toSender('join', {
      myID: newEntryID,
      userName: userName,
      memberList: memberList
    })
    this.userMessagingRepository.toOther('addUser', {
      newEntryID: newEntryID,
      userName: userName,
      memberList: memberList
    })

    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toSender('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
