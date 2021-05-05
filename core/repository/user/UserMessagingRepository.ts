export interface Sender {
  (eventName: string, data: any, targetID?: string): any
}

class UserMessagingRepository {
  private sender: Sender
  private broadcaster: Sender

  constructor(sender: Sender, broadcaster: Sender) {
    this.sender = sender
    this.broadcaster = broadcaster
  }

  toAll(eventName, data) {
    this.sender(eventName, data)
    this.broadcaster(eventName, data)
  }

  toOther(eventName, data) {
    this.broadcaster(eventName, data)
  }

  toSender(eventName, data) {
    this.sender(eventName, data)
  }

  to(eventName, data, targetID) {
    this.sender(eventName, data, targetID)
  }
}

export default UserMessagingRepository
