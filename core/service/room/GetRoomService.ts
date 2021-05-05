import RoomRepository from '../../repository/room/RoomRepository'

class GetRoomService {
  private roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async get(roomID: string) {
    return await this.roomRepository.get(roomID)
  }

  async getRemainingTime(roomID: string) {
    const res = await this.roomRepository.getExpire(roomID)
    return res > 0 ? Math.floor(res / (60*60)) : res
  }
}

export default GetRoomService
