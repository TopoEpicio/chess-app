import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SquareRenderer } from '../SquareRenderer'

function getSquareCenter(square: string, boardWidth: number): { x: number; y: number } {
  const files = 'abcdefgh'
  const fileIndex = files.indexOf(square[0])
  const rankIndex = parseInt(square[1]) - 1
  const squareSize = boardWidth / 8
  return {
    x: fileIndex * squareSize + squareSize / 2,
    y: (7 - rankIndex) * squareSize + squareSize / 2,
  }
}

describe('SquareRenderer', () => {
  it('renders nothing when no icons', () => {
    const { container } = render(
      <SquareRenderer icons={[]} boardWidth={400} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.querySelectorAll('text')).toHaveLength(0)
  })

  it('renders icon at correct square position', () => {
    const icons = [{ square: 'e4', icon: '!!', color: '#00e5b0' }]
    const { container } = render(
      <SquareRenderer icons={icons} boardWidth={400} />,
    )
    const texts = container.querySelectorAll('text')
    expect(texts).toHaveLength(1)
    expect(texts[0]).toHaveTextContent('!!')
  })

  it('renders multiple icons', () => {
    const icons = [
      { square: 'e4', icon: '!!', color: '#00e5b0' },
      { square: 'd5', icon: '??', color: '#f44336' },
    ]
    const { container } = render(
      <SquareRenderer icons={icons} boardWidth={400} />,
    )
    expect(container.querySelectorAll('text')).toHaveLength(2)
  })

  it('sets pointer-events to none', () => {
    const icons = [{ square: 'e4', icon: '!!', color: '#00e5b0' }]
    const { container } = render(
      <SquareRenderer icons={icons} boardWidth={400} />,
    )
    const svg = container.querySelector('svg')!
    expect(svg.style.pointerEvents).toBe('none')
  })

  it('uses boardWidth for viewBox and sizing', () => {
    const icons = [{ square: 'e4', icon: '!!', color: '#00e5b0' }]
    const { container } = render(
      <SquareRenderer icons={icons} boardWidth={520} />,
    )
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 520 520')
    expect(svg.style.width).toBe('520px')
    expect(svg.style.height).toBe('520px')
  })
})
