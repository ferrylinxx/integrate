// Tipos principales de la aplicación

export type AnswerValue = 1 | 2 | 3 | 4;

export interface Submission {
  groupCode: string;
  participantCode: string;
  answers: AnswerValue[]; // Array de 24 valores (6 áreas × 4 preguntas)
  timestamp: number;
}

export interface AreaData {
  areaNumber: number;
  areaName: string;
  questions: QuestionData[];
}

export interface QuestionData {
  questionNumber: number;
  label: string;
}

