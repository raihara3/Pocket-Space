const MeshRepositoryMock = jest.fn((storage) => {
  return {
    add: (roomID: string, data: any) => {
      storage[roomID] = storage[roomID] ? [...storage[roomID], data] : [data]
    },
    list: (roomID: string) => {
      return Object.keys(storage).length ? storage[roomID] : []
    },
    delete: (roomID: string) => {
      delete storage[roomID]
    },
  }
})
export default MeshRepositoryMock
