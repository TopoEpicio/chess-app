interface ClassificationIcon {
  square: string
  icon: string
  color: string
}

interface SquareRendererProps {
  icons: ClassificationIcon[]
  boardWidth: number
}

const FILES = 'abcdefgh'

function getSquareCenter(square: string, boardWidth: number): { x: number; y: number } {
  const fileIndex = FILES.indexOf(square[0])
  const rankIndex = parseInt(square[1]) - 1
  const squareSize = boardWidth / 8
  return {
    x: fileIndex * squareSize + squareSize / 2,
    y: (7 - rankIndex) * squareSize + squareSize / 2,
  }
}

export function SquareRenderer({ icons, boardWidth }: SquareRendererProps) {
  return (
    <svg
      viewBox={`0 0 ${boardWidth} ${boardWidth}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: boardWidth,
        height: boardWidth,
        pointerEvents: 'none',
      }}
    >
      {icons.map((icon) => {
        const center = getSquareCenter(icon.square, boardWidth)
        return (
          <text
            key={`${icon.square}-${icon.icon}`}
            x={center.x}
            y={center.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={icon.color}
            fontSize={boardWidth / 12}
            fontWeight="bold"
            style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
          >
            {icon.icon}
          </text>
        )
      })}
    </svg>
  )
}
