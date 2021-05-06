const RoomRepositoryMock = jest.fn((storage) => {
  return {
    add: (roomID: string) => {
      storage[roomID] = new Date()
        .toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
        })
        .toString()
    },

    get: (_: string) => {
      new Date()
        .toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
        })
        .toString()
    },

    getExpire: (_: string) => {
      return 60 * 60 * 24 * 3
    },
  }
})

export default RoomRepositoryMock
