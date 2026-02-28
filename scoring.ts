import { AnswerMap, DiagnosisScore, BigFiveFactor } from './diagnosis';
import { QUESTIONS } from './questions';

/**
 * 回答からスコアを計算する関数
 */
export const calculateScore = (answers: AnswerMap): DiagnosisScore => {
  const scores: DiagnosisScore = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  QUESTIONS.forEach((q) => {
    const rawValue = answers[q.id] || 3; // 未回答の場合は3(どちらともいえない)とする等の処理
    
    // 逆転項目の処理: 1⇄5, 2⇄4, 3=3
    // 計算式: 6 - rawValue
    const finalValue = q.isReverse ? 6 - rawValue : rawValue;

    scores[q.factor] += finalValue;
  });

  return scores;
};

/**
 * スコアの評価目安を判定する関数 (4問版に調整)
 */
export const getScoreLevel = (score: number): string => {
  // 4問なので Max 20, Min 4
  if (score >= 16) return 'かなり高い';
  if (score >= 13) return 'やや高い';
  if (score >= 10) return '平均的';
  if (score >= 7) return 'やや低い';
  return 'かなり低い';
};

/**
 * 自己診断と他者診断のズレ（一致度）を計算する関数
 * 戻り値: 0% 〜 100% (100%が完全一致)
 */
export const calculateMatchRate = (self: DiagnosisScore, friend: DiagnosisScore): number => {
  const factors: BigFiveFactor[] = ['O', 'C', 'E', 'A', 'N'];
  let totalDiff = 0;
  const maxDiffPerFactor = 16; // 20点 - 4点 = 16点 (最大乖離幅)
  
  factors.forEach(f => {
    totalDiff += Math.abs(self[f] - friend[f]);
  });

  const maxTotalDiff = maxDiffPerFactor * 5; // 全因子の最大乖離合計
  
  // ズレが0なら100%、ズレが最大なら0%
  const matchRate = 100 - (totalDiff / maxTotalDiff * 100);
  
  return Math.round(matchRate);
};