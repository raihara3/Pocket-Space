import React from 'react'
import renderer from 'react-test-renderer'
import InputField from '../InputField'

test('normal', () => {
  const tree = renderer
    .create(<InputField placeholder="Input field" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
test('readOnly', () => {
  const tree = renderer
    .create(<InputField placeholder="Input field" readonly={true} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
test('disabled', () => {
  const tree = renderer
    .create(<InputField placeholder="Input field" disabled={true} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
test('hasError', () => {
  const tree = renderer
    .create(
      <InputField
        placeholder="Input field"
        hasError={true}
        errorMessage="has error!"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
