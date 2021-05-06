import SocketMock from 'socket.io-mock'
import AddUserService from '../../AddUserService'
import UserMessagingRepository from '../../../../repository/user/UserMessagingRepository'
import MemberRepositoryMock from '../../../../repository/user/__mocks__/MemberRepository.mock'
import UserNameRepositoryMock from '../../../../repository/user/__mocks__/UserNameRepository.mock'
import MeshRepositoryMock from '../../../../repository/mesh/__mocks__/MeshRepository.mock'

const memberStorage: any = {}
const userNameStorage: any = {}
const meshStorage: any = {}
const memberRepositoryMock = new MemberRepositoryMock(memberStorage)
const userNameRepositoryMock = new UserNameRepositoryMock(userNameStorage)
const meshRepositoryMock = new MeshRepositoryMock(meshStorage)

const setUpSocket = (userID, userName, memberList) => {
  const socket = new SocketMock()
  const sender = (eventName, data) => {
    return socket.emit(eventName, data)
  }
  socket.socketClient.on('join', (data) => {
    expect(data).toEqual({
      myID: userID,
      userName: userName,
      memberList: memberList,
    })
  })
  socket.socketClient.on('addUser', (data) => {
    expect(data).toEqual({
      newEntryID: userID,
      userName: userName,
      memberList: memberList,
    })
  })
  socket.socketClient.on('getMesh', (data) => {
    expect(data).toEqual([])
  })
  return sender
}

describe.each([
  {
    roomID: 'testRoom1',
    userID: 'user1_id',
    userName: 'user1_name',
    response: {
      memberList: ['user1_id'],
    },
  },
  {
    roomID: 'testRoom2',
    userID: 'user2_id',
    userName: 'user2_name',
    response: {
      memberList: ['user2_id'],
    },
  },
])('AddUserService. (%o)', ({ roomID, userID, userName, response }) => {
  test('Enter the other Room', async () => {
    const sender = setUpSocket(userID, userName, response.memberList)
    const userMessagingRepository = new UserMessagingRepository(sender, sender)

    await new AddUserService(
      memberRepositoryMock,
      userNameRepositoryMock,
      meshRepositoryMock,
      userMessagingRepository
    ).execute(roomID, userID, userName)

    expect(memberRepositoryMock.add.call.length).toBe(1)
    expect(userNameRepositoryMock.add.call.length).toBe(1)
    expect(meshRepositoryMock.add.call.length).toBe(1)
  })
})
