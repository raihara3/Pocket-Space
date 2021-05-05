class History {
  private history: Array<string | null>

  constructor(length: number) {
    this.history = new Array(length).fill(null)
  }

  get getHistory() {
    return this.history
  }

  add(value: string) {
    this.history.shift()
    this.history.push(value)
    return value
  }

  back() {
    const value = this.history.pop()
    this.history.unshift(null)
    return value
  }

  deleteAll() {
    this.history.fill(null)
    return this.history
  }
}

export default History
