import React from 'react'
import renderer from 'react-test-renderer'
import Card from '../Card'

test('normal', () => {
  const tree = renderer
    .create(<Card title="normal" description="This is card item." />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
test('has contents', () => {
  const tree = renderer
    .create(
      <Card title="Has contents" description="This is card item.">
        <button>button</button>
      </Card>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
