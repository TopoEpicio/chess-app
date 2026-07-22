import { Chessboard as BaseChessboard } from 'react-chessboard'
import type { ChessboardOptions } from 'react-chessboard'
import { useBoardStyles } from './useBoardStyles'

type Props = { options?: ChessboardOptions }

export function Chessboard({ options }: Props) {
  const { darkSquareStyle, lightSquareStyle, boardStyle } = useBoardStyles()
  const mergedOptions = {
    ...options,
    darkSquareStyle: { ...options?.darkSquareStyle, ...darkSquareStyle },
    lightSquareStyle: { ...options?.lightSquareStyle, ...lightSquareStyle },
    boardStyle: { ...boardStyle, ...options?.boardStyle },
  }

  return <BaseChessboard options={mergedOptions} />
}
