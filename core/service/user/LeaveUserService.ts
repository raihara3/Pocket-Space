import MemberRepository from '../../repository/user/MemberRepository'
import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserNameRepository from '../../repository/user/UserNameRepository'

class LeaveUserService {
  private memberRepository: MemberRepository
  private userNameRepository: UserNameRepository
  private userMessagingRepository: UserMessagingRepository

  constructor(memberRepository, userNameRepository, userMessagingRepository) {
    this.memberRepository = memberRepository
    this.userNameRepository = userNameRepository
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, userID: string) {
    await this.userNameRepository.remove(userID)
    await this.memberRepository.remove(roomID, userID)
    const memberList = await this.memberRepository.list(roomID)
    this.userMessagingRepository.toOther('leaveUser', {
      userID: userID,
      memberList: memberList,
    })
  }
}

export default LeaveUserService
