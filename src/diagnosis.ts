export type DiagnosisScore = {
  E: number; // 外向性
  A: number; // 協調性
  C: number; // 誠実性
  N: number; // 神経症傾向
  O: number; // 開放性
};

export type DiagnosisType = {
  name: string;
  description: string;
};

export type AnswerMap = Record<number, 1 | 2 | 3 | 4 | 5>;