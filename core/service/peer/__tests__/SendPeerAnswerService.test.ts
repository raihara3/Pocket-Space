import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import SendPeerAnswerService from '../SendPeerAnswerService'

const data = {
  targetID: 'test_target_id',
  senderID: 'test_sender_id',
  sdp: {},
}

describe('SendPeerAnswerService', () => {
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const sendPeerAnswerService = new SendPeerAnswerService(
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await sendPeerAnswerService.execute(data)

    expect(userMessagingRepositoryMock.to.call.length).toBe(1)
  })
})
