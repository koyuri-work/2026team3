export type BigFiveFactor = 'O' | 'C' | 'E' | 'A' | 'N';

export interface Question {
  id: number;
  text: string;
  factor: BigFiveFactor;
  isReverse: boolean; // 逆転項目かどうか
}

export interface DiagnosisScore {
  O: number; // 開放性
  C: number; // 誠実性
  E: number; // 外向性
  A: number; // 協調性
  N: number; // 神経症傾向
}

// 1問ごとの回答 (1-5)
export type AnswerMap = Record<number, 1 | 2 | 3 | 4 | 5>;