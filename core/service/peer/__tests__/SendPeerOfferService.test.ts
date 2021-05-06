import UserMessagingRepositoryMock from '../../../repository/user/__mocks__/UserMessagingRepository.mock'
import SendPeerOfferService from '../SendPeerOfferService'

const data = {
  targetID: 'test_target_id',
  senderID: 'test_sender_id',
  sdp: {},
}

describe('SendPeerOfferService', () => {
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const sendPeerOfferService = new SendPeerOfferService(
    userMessagingRepositoryMock
  )

  test('execute', async () => {
    await sendPeerOfferService.execute(data)
    expect(userMessagingRepositoryMock.to.call.length).toBe(1)
  })
})
