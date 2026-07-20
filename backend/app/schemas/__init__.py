from app.schemas.analysis import (
    AnalysisProgress,
    AnalysisRequest,
    CoachFeedback,
    EngineLine,
    GameAnalysisCreate,
    GameAnalysisRead,
    GameSummary,
    KeyMomentRead,
)
from app.schemas.settings import SettingsOut
from app.schemas.common import (
    ErrorResponse,
    HealthResponse,
    Page,
    PaginationParams,
    ValidationErrorDetail,
)
from app.schemas.openings import (
    EcoCode,
    OpeningCreate,
    OpeningRead,
    OpeningUpdate,
)
from app.schemas.puzzle import (
    PuzzleAttemptCreate,
    PuzzleAttemptRead,
    PuzzleCreate,
    PuzzleFilter,
    PuzzleRead,
    PuzzleStats,
    PuzzleUpdate,
)
from app.schemas.repertoire import (
    QuizAnswer,
    QuizQuestion,
    QuizRequest,
    QuizResult,
    RepertoireExportRequest,
    RepertoireImportRequest,
    RepertoireNodeCreate,
    RepertoireNodeRead,
    RepertoireNodeUpdate,
    RepertoireTreeRead,
)
from app.schemas.stats import (
    DailyStatsCreate,
    DailyStatsRead,
    RatingProgress,
    StatsSummary,
    StreakData,
)
from app.schemas.study import (
    FolderResourceLink,
    StudyFolderCreate,
    StudyFolderRead,
    StudyFolderTree,
    StudyFolderUpdate,
    StudyResourceCreate,
    StudyResourceRead,
    StudyResourceUpdate,
)

# Aliases for backward compatibility
PuzzleOut = PuzzleRead
AttemptCreate = PuzzleAttemptCreate
NodeCreate = RepertoireNodeCreate
NodeUpdate = RepertoireNodeUpdate
NodeOut = RepertoireNodeRead
GameOut = GameAnalysisRead
ImportRequest = AnalysisRequest
MoveItem = EngineLine
DailyStatsOut = DailyStatsRead
OpeningOut = OpeningRead
StudyFolderOut = StudyFolderRead
StudyResourceOut = StudyResourceRead

__all__ = [
    # Common
    "ErrorResponse",
    "ValidationErrorDetail",
    "PaginationParams",
    "Page",
    "HealthResponse",
    "SettingsOut",
    # Puzzle
    "PuzzleRead",
    "PuzzleCreate",
    "PuzzleUpdate",
    "PuzzleFilter",
    "PuzzleStats",
    "PuzzleAttemptCreate",
    "PuzzleAttemptRead",
    # Repertoire
    "RepertoireNodeCreate",
    "RepertoireNodeUpdate",
    "RepertoireNodeRead",
    "RepertoireTreeRead",
    "RepertoireImportRequest",
    "RepertoireExportRequest",
    "QuizRequest",
    "QuizQuestion",
    "QuizAnswer",
    "QuizResult",
    # Analysis
    "GameAnalysisCreate",
    "GameAnalysisRead",
    "GameSummary",
    "KeyMomentRead",
    "AnalysisRequest",
    "AnalysisProgress",
    "EngineLine",
    "CoachFeedback",
    # Stats
    "DailyStatsCreate",
    "DailyStatsRead",
    "StatsSummary",
    "StreakData",
    "RatingProgress",
    "PuzzleStats",
    # Openings
    "OpeningCreate",
    "OpeningUpdate",
    "OpeningRead",
    "EcoCode",
    # Study
    "StudyFolderCreate",
    "StudyFolderUpdate",
    "StudyFolderRead",
    "StudyFolderTree",
    "StudyResourceCreate",
    "StudyResourceUpdate",
    "StudyResourceRead",
    "FolderResourceLink",
]
