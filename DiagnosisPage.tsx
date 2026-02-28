import { useState } from 'react';
import { QUESTIONS } from './questions';
import { calculateScore } from './scoring';
import { AnswerMap } from './diagnosis';

export const DiagnosisPage = () => {
  const [answers, setAnswers] = useState<AnswerMap>({});

  const handleAnswer = (qId: number, value: 1 | 2 | 3 | 4 | 5) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    const result = calculateScore(answers);
    console.log("診断結果:", result);
    // ここでDBに保存し、結果画面へ遷移する処理を追加予定
    alert("診断が完了しました！結果はコンソールを確認してください。");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">性格診断 (20問)</h1>
      {QUESTIONS.map((q) => (
        <div key={q.id} className="mb-6 border-b pb-4">
          <p className="mb-2 font-medium">{q.text}</p>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(q.id, val as 1 | 2 | 3 | 4 | 5)}
                className={`w-10 h-10 rounded-full ${
                  answers[q.id] === val 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
               <span>No</span>
               <span>Yes</span>
          </div>
        </div>
      ))}
      <button 
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < QUESTIONS.length}
        className="w-full bg-green-500 text-white py-3 rounded-lg disabled:bg-gray-300"
      >
        診断結果を見る
      </button>
    </div>
  );
};