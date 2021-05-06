import MemberRepositoryMock from '../../../repository/user/__mocks__/MemberRepository.mock'
import MeshRepositoryMock from '../../../repository/mesh/__mocks__/MeshRepository.mock'
import UserNameRepositoryMock from '../../../repository/user/__mocks__/UserNameRepository.mock'
import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import LeaveUserService from '../LeaveUserService'

const memberStorage: any = {}
const meshStorage: any = {}
const usernameStorage: any = {}

const roomID = 'testRoom'
const userID = 'test_id'

describe('LeaveUserService', () => {
  const memberRepositoryMock = new MemberRepositoryMock(memberStorage)
  const meshRepositoryMock = new MeshRepositoryMock(meshStorage)
  const userNameRepositoryMock = new UserNameRepositoryMock(usernameStorage)
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const leaveUserService = new LeaveUserService(
    memberRepositoryMock,
    userNameRepositoryMock,
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await leaveUserService.execute(roomID, userID)

    expect(userNameRepositoryMock.remove.call.length).toBe(1)
    expect(memberRepositoryMock.remove.call.length).toBe(1)
    expect(userMessagingRepositoryMock.toOther.call.length).toBe(1)

    if (!memberRepositoryMock.list(roomID)) {
      expect(meshRepositoryMock.delete.call.length).toBe(1)
    }
  })
})
