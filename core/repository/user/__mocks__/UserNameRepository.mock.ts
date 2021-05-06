const UserNameRepositoryMock = jest.fn((storage) => {
  return {
    add: (userID: string, userName: string) => {
      storage[userID] = userName
    },
    remove: (userID: string) => {
      delete storage[userID]
    },
  }
})
export default UserNameRepositoryMock
