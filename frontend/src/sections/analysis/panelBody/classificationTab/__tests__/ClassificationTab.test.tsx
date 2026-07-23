import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClassificationTab } from '../index'

describe('ClassificationTab', () => {
  it('renders move table with classification counts', () => {
    const onMoveSelect = vi.fn()
    render(
      <ClassificationTab
        moves={[]}
        classificationCounts={{}}
        currentIndex={3}
        onMoveSelect={onMoveSelect}
      />
    )
    expect(screen.getByText('Mosse')).toBeInTheDocument()
  })
})
