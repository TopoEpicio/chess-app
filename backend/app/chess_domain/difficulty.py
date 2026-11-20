BASE_DIFFICULTY: dict[str, int] = {
    "hanging_piece": 2,
    "fork": 3,
    "skewer": 4,
    "pin": 5,
    "double_attack": 4,
    "checkmate": 6,
}


class DifficultyCalculator:
    @staticmethod
    def calculate(theme: str, solution_length: int, has_capture: bool) -> int:
        base = BASE_DIFFICULTY.get(theme, 3)
        if solution_length >= 6:
            base += 4
        elif solution_length >= 4:
            base += 2
        if has_capture:
            base += 1
        return max(1, min(10, base))
