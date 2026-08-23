export interface PaperOption {
  id: number;
  order: number;
  text: string;
  image?: string;
  isCorrect?: boolean;
}

export interface PaperTfItem {
  id: number;
  order: number;
  text: string;
  image?: string;
  answer?: boolean;
}

export interface PaperQuestion {
  examExerciseId: number;
  exerciseId: number;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  points: number;
  questionText: string;
  questionImage?: string;
  options?: PaperOption[];
  trueFalseItems?: PaperTfItem[];
  essayAnswer?: string;
  essayAnswerImage?: string;
}

// Map<Long, ...> ở Java → Record<string, T> ở TS (key JSON luôn là string dù Java là Long).
export interface SubmitExamRequest {
  mc: Record<string, number>;
  tf: Record<string, Record<string, boolean>>;
  essay: Record<string, string>;
}

export interface QuestionGrade {
  examExerciseId: number;
  earned: number;
  max: number;
  correct?: boolean;
}

export interface ExamGradeResponse {
  earned: number;
  total: number;
  autoCorrect: number;
  autoTotal: number;
  hasEssay: boolean;
  byQuestion: QuestionGrade[];
}

export interface ExamPaperResponse {
  examId: number;
  code: string;
  name: string;
  durationMinutes?: number;
  deadline?: string;
  status: string;
  questions: PaperQuestion[];
  submitted?: SubmitExamRequest;
  score?: number;
  result?: ExamGradeResponse;
}
