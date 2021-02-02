import { BroadCast } from '../src/BroadCaster'
import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/redis'

class LeaveUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository

  constructor(ur, mr) {
    this.userRepository = ur
    this.meshRepository = mr
  }

  execute(roomID: string, listener: BroadCast) {
    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    console.log(`disconnect: ${listener.id}`)
    this.userRepository.remove(roomID, listener.id)
    if(!listener.adapter.rooms.has(roomID)) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
