import History from '../History'

describe('History', () => {
  const SAVE_LENGTH = 5
  const history = new History(SAVE_LENGTH)

  test('add', () => {
    history.add('his1')
    history.add('his2')
    history.add('his3')
    expect(history.getHistory).toEqual([null, null, 'his1', 'his2', 'his3'])
  })
  test('back', () => {
    history.back()
    expect(history.getHistory).toEqual([null, null, null, 'his1', 'his2'])
  })
  test('deleteAll', () => {
    history.deleteAll()
    expect(history.getHistory).toEqual([null, null, null, null, null])
  })
})
