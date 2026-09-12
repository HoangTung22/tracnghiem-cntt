from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime as dt


# --- User ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Subject ---
class SubjectCreate(BaseModel):
    name: str
    code: str

class SubjectResponse(BaseModel):
    id: int
    name: str
    code: str

    class Config:
        from_attributes = True


# --- Chapter ---
class ChapterCreate(BaseModel):
    name: str
    subject_id: int

class ChapterResponse(BaseModel):
    id: int
    name: str
    subject_id: int

    class Config:
        from_attributes = True


# --- Answer ---
class AnswerCreate(BaseModel):
    content: str
    is_correct: bool = False

class AnswerResponse(BaseModel):
    id: int
    content: str
    is_correct: bool

    class Config:
        from_attributes = True


# --- Question ---
class QuestionCreate(BaseModel):
    content: str
    difficulty: str = "medium"
    chapter_id: int
    answers: List[AnswerCreate]

class QuestionResponse(BaseModel):
    id: int
    content: str
    difficulty: str
    chapter_id: int
    answers: List[AnswerResponse]

    class Config:
        from_attributes = True


# --- Exam ---
class ExamCreate(BaseModel):
    title: str
    subject_id: int
    chapter_id: Optional[int] = None  # None = đề tổng hợp cả môn
    question_count: int = 10
    duration_minutes: int = 30
    difficulty: Optional[str] = None  # None = lấy đủ mọi độ khó

class ExamAnswerResponse(BaseModel):
    id: int
    content: str
    # Không có is_correct — sinh viên không được thấy đáp án đúng

    class Config:
        from_attributes = True

class ExamQuestionResponse(BaseModel):
    id: int
    content: str
    answers: List[ExamAnswerResponse]

    class Config:
        from_attributes = True

class ExamResponse(BaseModel):
    id: int
    title: str
    subject_id: int
    chapter_id: Optional[int] = None
    question_count: int
    duration_minutes: int
    is_archived: bool = False
    attempts_count: int = 0

    class Config:
        from_attributes = True

class ExamDetailResponse(BaseModel):
    id: int
    title: str
    duration_minutes: int
    questions: List[ExamQuestionResponse]

    class Config:
        from_attributes = True


# --- Attempt (làm bài & chấm điểm) ---
class AttemptAnswerSubmit(BaseModel):
    question_id: int
    selected_answer_id: int

class AttemptSubmit(BaseModel):
    answers: List[AttemptAnswerSubmit]

class AttemptAnswerResult(BaseModel):
    question_id: int
    question_content: str
    selected_answer_id: int
    selected_answer_content: str
    is_correct: bool
    correct_answer_id: int
    correct_answer_content: str

class AttemptResultResponse(BaseModel):
    id: int
    exam_id: int
    score: float
    total_questions: int
    correct_count: int
    details: List[AttemptAnswerResult]

class AttemptSummaryResponse(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    score: float
    started_at: dt
    finished_at: Optional[dt]

    class Config:
        from_attributes = True

class AttemptDetailResponse(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    score: float
    total_questions: int
    correct_count: int
    started_at: dt
    finished_at: Optional[dt]
    details: List[AttemptAnswerResult]


# --- Thống kê ---
class ChapterStatResponse(BaseModel):
    chapter_id: int
    chapter_name: str
    subject_name: str
    total_answered: int
    correct_count: int
    accuracy: float

class StudentStatsResponse(BaseModel):
    total_attempts: int
    average_score: float
    highest_score: float
    by_chapter: List[ChapterStatResponse]

class AdminOverviewResponse(BaseModel):
    total_students: int
    total_questions: int
    total_exams: int
    total_attempts: int
    average_score: float


# --- Tổng quan cho Admin ---
class SubjectOverviewItem(BaseModel):
    id: int
    name: str
    code: str
    total_chapters: int
    total_questions: int

class ChapterWithCount(BaseModel):
    id: int
    name: str
    question_count: int

class SubjectDetailOverview(BaseModel):
    subject_id: int
    subject_name: str
    total_chapters: int
    total_questions: int
    chapters: List[ChapterWithCount]

class ImportResultResponse(BaseModel):
    success_count: int
    error_count: int
    errors: List[str]