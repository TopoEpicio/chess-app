import chess

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}


class PositionEvaluator:
    @staticmethod
    def evaluate(fen: str) -> int:
        board = chess.Board(fen)
        score = 0
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if piece:
                val = PIECE_VALUES.get(piece.piece_type, 0)
                if piece.color == chess.WHITE:
                    score += val
                else:
                    score -= val
        return score
