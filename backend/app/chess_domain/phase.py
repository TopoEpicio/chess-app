import chess

from app.chess_domain.types import GamePhase


class PhaseDetector:
    @staticmethod
    def detect(fen: str, move_number: int) -> GamePhase:
        if move_number <= 12:
            return GamePhase.OPENING

        board = chess.Board(fen)
        non_pawn = 0
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if piece and piece.piece_type not in (chess.KING, chess.PAWN):
                non_pawn += 1

        if non_pawn <= 7:
            return GamePhase.ENDGAME

        return GamePhase.MIDDLEGAME
