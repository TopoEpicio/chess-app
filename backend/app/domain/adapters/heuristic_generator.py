from io import StringIO

import chess
import chess.pgn

from app.domain.protocols import TacticalMoment

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}

PIECE_NAMES = {
    chess.PAWN: "p",
    chess.KNIGHT: "n",
    chess.BISHOP: "b",
    chess.ROOK: "r",
    chess.QUEEN: "q",
    chess.KING: "k",
}


class HeuristicPuzzleGenerator:
    """Translates PGN games into tactical puzzle moments using heuristic rules."""

    @staticmethod
    def _find_forks(board: chess.Board) -> list[tuple[str, str, list[str]]]:
        turn = board.turn
        forks = []
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if piece and piece.color == turn:
                moves = board.attacks(sq)
                targets = []
                for t_sq in chess.SQUARES:
                    if not moves & (1 << t_sq):
                        continue
                    target = board.piece_at(t_sq)
                    if target and target.color != turn:
                        target_value = PIECE_VALUES.get(target.piece_type, 0)
                        if target_value >= PIECE_VALUES.get(piece.piece_type, 0):
                            targets.append((t_sq, target))
                if len(targets) >= 2:
                    san = board.san(chess.Move(sq, targets[0][0]))
                    forks.append((
                        san,
                        PIECE_NAMES.get(piece.piece_type, "?"),
                        [chess.SQUARE_NAMES[t[0]] for t in targets],
                    ))
        return forks

    @staticmethod
    def _find_pins(board: chess.Board, color: chess.Color) -> list[tuple[int, int]]:
        pins = []
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if piece and piece.color == color and piece.piece_type == chess.KING:
                king_sq = sq
                break
        else:
            return pins
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if not piece or piece.color != color or piece.piece_type == chess.KING:
                continue
            if board.is_pinned(color, sq):
                pins.append((king_sq, sq))
        return pins

    @staticmethod
    def _find_hanging_pieces(board: chess.Board, color: chess.Color) -> list[str]:
        hanging = []
        for sq in chess.SQUARES:
            piece = board.piece_at(sq)
            if piece and piece.color == color and piece.piece_type != chess.KING:
                attackers = board.attackers(not color, sq)
                defenders = board.attackers(color, sq)
                if len(attackers) > len(defenders):
                    hanging.append(chess.SQUARE_NAMES[sq])
        return hanging

    @staticmethod
    def _eval_from_side(board: chess.Board, side: chess.Color) -> int:
        raw = HeuristicPuzzleGenerator._quick_eval(board)
        return raw if side == chess.WHITE else -raw

    @staticmethod
    def _quick_eval(board: chess.Board) -> int:
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

    @staticmethod
    def _build_solution_from_board(
        board: chess.Board, move_san: str, node: chess.pgn.GameNode | None = None, max_depth: int = 6
    ) -> list[str]:
        solution = [move_san]
        temp_board = board.copy()
        try:
            temp_board.push_san(move_san)
        except (ValueError, chess.InvalidMoveError):
            return solution

        user_color = board.turn

        if node is not None:
            cur = node
            for _ in range(max_depth - 1):
                if not cur.variations:
                    break
                if temp_board.is_game_over():
                    break
                cur = cur.variations[0]
                if cur.move is None:
                    break
                try:
                    san = temp_board.san(cur.move)
                    solution.append(san)
                    temp_board.push(cur.move)
                except (ValueError, chess.InvalidMoveError):
                    break
        else:
            for depth in range(max_depth - 1):
                if temp_board.is_game_over():
                    break

                best = None
                is_opponent = depth % 2 == 0

                if is_opponent:
                    best_score = 99999
                    for move in temp_board.legal_moves:
                        temp_board.push(move)
                        score = HeuristicPuzzleGenerator._eval_from_side(temp_board, user_color)
                        if temp_board.is_checkmate():
                            score = -9999
                        temp_board.pop()
                        if score < best_score:
                            best_score = score
                            best = move
                else:
                    best_score = -99999
                    for move in temp_board.legal_moves:
                        temp_board.push(move)
                        score = HeuristicPuzzleGenerator._eval_from_side(temp_board, user_color)
                        if temp_board.is_checkmate():
                            score = 9999
                        temp_board.pop()
                        if score > best_score:
                            best_score = score
                            best = move

                if best is None:
                    break

                san = temp_board.san(best)
                solution.append(san)
                temp_board.push(best)

        return solution

    @staticmethod
    def _calculate_difficulty(theme: str, solution_length: int, has_capture: bool) -> int:
        base = {
            "hanging_piece": 2,
            "fork": 3,
            "skewer": 4,
            "pin": 5,
            "double_attack": 4,
            "checkmate": 6,
        }.get(theme, 3)
        if solution_length >= 6:
            base += 4
        elif solution_length >= 4:
            base += 2
        if has_capture:
            base += 1
        return max(1, min(10, base))

    @staticmethod
    def _detect_phase(fen: str, move_number: int) -> str:
        if move_number <= 12:
            return "opening"
        board = chess.Board(fen) if fen != "start" else chess.Board()
        non_pawn = sum(
            1 for sq in chess.SQUARES
            if (p := board.piece_at(sq))
            and p.piece_type not in (chess.KING, chess.PAWN)
        )
        if non_pawn <= 7:
            return "endgame"
        return "middlegame"

    @staticmethod
    def _detect_patterns(board: chess.Board, move_san: str, side: chess.Color) -> list[str]:
        patterns = []

        move = None
        for m in board.legal_moves:
            if board.san(m) == move_san:
                move = m
                break
        if move is None:
            return patterns

        temp = board.copy()
        try:
            temp.push(move)
        except (ValueError, chess.InvalidMoveError):
            return patterns

        if temp.is_checkmate():
            return ["checkmate"]

        target_sq = move.to_square
        target_piece = board.piece_at(target_sq)
        attacker_piece = board.piece_at(move.from_square)

        hanging = HeuristicPuzzleGenerator._find_hanging_pieces(temp, not side)

        if attacker_piece and attacker_piece.piece_type in (chess.KNIGHT, chess.PAWN, chess.BISHOP, chess.ROOK, chess.QUEEN):
            attack_bb = temp.attacks(move.to_square)
            targets_after = []
            for sq in chess.SQUARES:
                if attack_bb & (1 << sq):
                    p = temp.piece_at(sq)
                    if p and p.color != side and p.piece_type != chess.KING:
                        targets_after.append(sq)
            if len(targets_after) >= 2:
                patterns.append("fork")

        if attacker_piece and target_piece:
            captured_value = PIECE_VALUES.get(target_piece.piece_type, 0)
            attacker_value = PIECE_VALUES.get(attacker_piece.piece_type, 0)
            if captured_value >= attacker_value and captured_value >= 3:
                patterns.append("double_attack")
        if not patterns and attacker_piece:
            attack_bb = temp.attacks(move.to_square)
            targets = []
            for sq in chess.SQUARES:
                if attack_bb & (1 << sq):
                    p = temp.piece_at(sq)
                    if p and p.color != side and p.piece_type != chess.KING and PIECE_VALUES.get(p.piece_type, 0) >= 3:
                        targets.append(sq)
            if len(targets) >= 2:
                patterns.append("double_attack")

        pins = HeuristicPuzzleGenerator._find_pins(board, not side)
        if pins:
            for king_sq, pin_sq in pins:
                pin_piece = board.piece_at(pin_sq)
                if pin_piece and pin_piece.piece_type != chess.KING:
                    if move.to_square == pin_sq or move.from_square == pin_sq or move.to_square == king_sq:
                        if "pin" not in patterns:
                            patterns.append("pin")

        opp_king = board.king(side)
        if target_piece and target_piece.piece_type == chess.KING and opp_king is not None:
            file_diff = abs(chess.square_file(target_sq) - chess.square_file(opp_king))
            rank_diff = abs(chess.square_rank(target_sq) - chess.square_rank(opp_king))
            if file_diff == rank_diff or file_diff == 0 or rank_diff == 0:
                pieces_between = []
                for sq in chess.SQUARES:
                    p = board.piece_at(sq)
                    if p and p.color != side and sq != target_sq and sq != opp_king:
                        between = chess.SquareSet.between(target_sq, opp_king)
                        if between & (1 << sq):
                            pieces_between.append(sq)
                if pieces_between:
                    patterns.append("skewer")

        if not patterns and hanging:
            patterns.append("hanging_piece")

        return patterns

    def generate_moments(self, pgn_text: str, min_move_number: int = 8) -> list[TacticalMoment]:
        game = chess.pgn.read_game(StringIO(pgn_text))
        if game is None:
            return []

        board = game.board()
        moments: list[TacticalMoment] = []

        prev_eval = self._quick_eval(board)
        prev_fen = board.fen()

        for node in game.mainline():
            move = node.move
            if move is None:
                continue

            move_color = board.turn
            move_san = board.san(move)
            board.push(move)
            current_eval = self._quick_eval(board)
            current_fen = board.fen()
            move_number = board.fullmove_number

            if move_color == chess.WHITE:
                swing = current_eval - prev_eval
            else:
                swing = prev_eval - current_eval

            is_tactical = swing >= 2.0 or (board.is_checkmate() and prev_eval > -5)

            if is_tactical and move_number >= min_move_number:
                fen_before = prev_fen

                temp_board = chess.Board(fen_before) if fen_before != "start" else chess.Board()
                patterns = self._detect_patterns(temp_board, move_san, move_color)

                if not patterns:
                    prev_eval = current_eval
                    prev_fen = current_fen
                    continue

                theme = patterns[0]
                solution = self._build_solution_from_board(temp_board, move_san, node)

                if len(solution) < 3:
                    prev_eval = current_eval
                    prev_fen = current_fen
                    continue

                has_capture = any("x" in s for s in solution)
                difficulty = self._calculate_difficulty(theme, len(solution), has_capture)
                phase = self._detect_phase(fen_before, move_number)

                moments.append(TacticalMoment(
                    fen_before=fen_before,
                    winning_move_san=move_san,
                    theme=theme,
                    solution=solution,
                    difficulty=difficulty,
                    phase=phase,
                ))

            prev_eval = current_eval
            prev_fen = current_fen

        return moments

    def generate_moments_from_key_moments(self, items: list[dict]) -> list[TacticalMoment]:
        moments = []
        for item in items:
            fen = item.get("fen", "")
            move_san = item.get("move_san", "")
            moment_type = item.get("moment_type", "")
            eval_before = item.get("eval_before", 0)
            eval_after = item.get("eval_after", 0)
            move_number = item.get("move_number", 0)

            swing = abs((eval_after or 0) - (eval_before or 0))
            if swing < 2.0 and moment_type not in ("checkmate", "blunder"):
                continue

            board = chess.Board(fen) if fen and fen != "start" else chess.Board()
            if not move_san:
                continue

            patterns = self._detect_patterns(board, move_san, board.turn)
            if not patterns:
                continue

            theme = moment_type if moment_type in ("fork", "pin", "skewer", "checkmate", "double_attack", "hanging_piece") else patterns[0]
            solution = self._build_solution_from_board(board, move_san)

            if len(solution) < 3:
                continue

            has_capture = any("x" in s for s in solution)
            difficulty = self._calculate_difficulty(theme, len(solution), has_capture)
            phase = self._detect_phase(fen, move_number)

            moments.append(TacticalMoment(
                fen_before=fen,
                winning_move_san=move_san or "",
                theme=theme,
                solution=solution,
                difficulty=difficulty,
                phase=phase,
            ))
        return moments

    @staticmethod
    def generate_puzzle_from_moment(moment: TacticalMoment, game_id: int, user_id: int = 1) -> dict:
        return {
            "user_id": user_id,
            "fen": moment.fen_before,
            "solution": moment.solution,
            "theme": [moment.theme],
            "difficulty": moment.difficulty,
            "phase": moment.phase,
            "source": "auto",
            "source_game_id": game_id,
        }
