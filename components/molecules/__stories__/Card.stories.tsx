import React from 'react'
import Card from '../Card'

export const normal = () => {
  return <Card title="normal" description="This is card item."></Card>
}

export const hasContents = () => {
  return (
    <Card title="Has contents" description="This is card item.">
      <button>button</button>
    </Card>
  )
}

export default {
  title: 'Card',
}
