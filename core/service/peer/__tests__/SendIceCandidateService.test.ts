import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import SendIceCandidateService from '../SendIceCandidateService'

const data = {
  targetID: 'test_target_id',
  senderID: 'test_sender_id',
  ice: {},
}

describe('SendIceCandidateService', () => {
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const sendIceCandidateService = new SendIceCandidateService(
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await sendIceCandidateService.execute(data)

    expect(userMessagingRepositoryMock.to.call.length).toBe(1)
  })
})
