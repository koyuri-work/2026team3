import { useState } from 'react';
import { QUESTIONS } from './questions';
import { calculateScore, determineType } from './scoring';
import { AnswerMap, DiagnosisScore, DiagnosisType } from './diagnosis';

export const DiagnosisPage = () => {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisScore | null>(null);
  const [diagnosisType, setDiagnosisType] = useState<DiagnosisType | null>(null);

  const QUESTIONS_PER_PAGE = 20;

  const handleAnswer = (qId: number, value: 1 | 2 | 3 | 4 | 5) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNext = () => {
    if (currentIndex + QUESTIONS_PER_PAGE < QUESTIONS.length) {
      setCurrentIndex(prev => prev + QUESTIONS_PER_PAGE);
      window.scrollTo(0, 0);
    } else {
      const score = calculateScore(answers);
      setResult(score);
      setDiagnosisType(determineType(score));
    }
  };

  // 結果表示画面
  if (result && diagnosisType) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">診断完了！</h2>
        
        <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-2">{diagnosisType.name}</h3>
          <p className="text-gray-700 text-left leading-relaxed">
            {diagnosisType.description}
          </p>
        </div>
        
        <div className="text-left bg-gray-50 p-6 rounded-lg space-y-2 mb-8">
            <p>🟡 開放性 (O): {result.O}</p>
            <p>🟣 誠実性 (C): {result.C}</p>
            <p>🔵 外向性 (E): {result.E}</p>
            <p>🟢 協調性 (A): {result.A}</p>
            <p>🔴 神経症傾向 (N): {result.N}</p>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold"
        >
          もう一度診断する
        </button>
      </div>
    );
  }

  // 質問表示画面
  const currentQuestions = QUESTIONS.slice(currentIndex, currentIndex + QUESTIONS_PER_PAGE);
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);
  const isPageComplete = currentQuestions.every(q => answers[q.id]);

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* 進捗バー */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-1">
          {Math.min(Object.keys(answers).length, QUESTIONS.length)} / {QUESTIONS.length}
        </p>
      </div>

      <div className="space-y-8 mb-8">
        {currentQuestions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 text-lg">Q{q.id}. {q.text}</h3>
            <div className="flex justify-between gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(q.id, val as 1|2|3|4|5)}
                  className={`w-10 h-10 rounded-full font-bold transition-colors flex items-center justify-center ${
                    answers[q.id] === val
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>まったく<br/>当てはまらない</span>
              <span className="text-right">とても<br/>当てはまる</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!isPageComplete}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {currentIndex + QUESTIONS_PER_PAGE >= QUESTIONS.length ? '診断結果を見る' : '次へ'}
      </button>
    </div>
  );
};