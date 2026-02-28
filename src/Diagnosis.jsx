import { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { QUESTIONS } from '../questions';
import { IMAGES } from '../constants';
import { determineType } from '../utils';
import './Diagnosis.css';

const Diagnosis = ({ session }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const targetFriend = location.state?.targetFriend;
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const screenRef = useRef(null);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);
  const startIndex = (page - 1) * questionsPerPage;
  const currentQuestions = QUESTIONS.slice(startIndex, startIndex + questionsPerPage);

  const handleAnswer = (qId, rating) => {
    setAnswers(prev => ({ ...prev, [qId]: rating }));
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      if (screenRef.current) {
        screenRef.current.scrollTo(0, 0);
      }
    } else {
      finishDiagnosis();
    }
  };

  const finishDiagnosis = async () => {
    const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    QUESTIONS.forEach((q) => {
      let rawScore = answers[q.id];
      if (rawScore) {
        scores[q.factor] += q.isReverse ? (6 - rawScore) : rawScore;
      }
    });
    const averageScores = {};
    Object.keys(scores).forEach(key => { averageScores[key] = scores[key] / 4; });
    const resultTypeKey = determineType(averageScores);
    if (session) {
      await supabase.from('diagnosis_results').insert({
        target_user_id: targetFriend ? targetFriend.id : session.user.id, created_by: session.user.id, result_key: resultTypeKey, scores: { ...averageScores, diagnosis_type: type }
      });
    }
    navigate('/result', { state: { resultKey: resultTypeKey, scores: averageScores, date: new Date().toISOString(), isMine: true } });
  };

  return (
    <div className="diagnosis-screen" ref={screenRef}>
      <div className="diagnosis-header">
        <div className="diagnosis-back" onClick={() => page > 1 ? setPage(page - 1) : navigate(-1)}></div>
        <div className="diagnosis-menu">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div className="diagnosis-subtitle">{targetFriend ? `${targetFriend.username} さんへの質問` : 'あなたへの質問'}</div>
      <div className="diagnosis-title">Question {page}/{totalPages}</div>

      <div className="diagnosis-card">
        {currentQuestions.map((q) => (
          <div key={q.id} className="diagnosis-question-item">
            <p>{q.text}</p>
            <div className="diagnosis-choices">
              <div className="diagnosis-choice-wrapper"><img src={IMAGES.leftImg} className={`diagnosis-img diagnosis-img-1 ${answers[q.id] === 1 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 1)} alt="当てはまらない" /><span className="diagnosis-label">そう思う</span></div>
              <img src={IMAGES.sLeftImg} className={`diagnosis-img diagnosis-img-2 ${answers[q.id] === 2 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 2)} alt="あまり当てはまらない" />
              <img src={IMAGES.midImg} className={`diagnosis-img diagnosis-img-3 ${answers[q.id] === 3 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 3)} alt="どちらともいえない" />
              <img src={IMAGES.sRightImg} className={`diagnosis-img diagnosis-img-4 ${answers[q.id] === 4 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 4)} alt="やや当てはまる" />
              <div className="diagnosis-choice-wrapper"><img src={IMAGES.rightImg} className={`diagnosis-img diagnosis-img-5 ${answers[q.id] === 5 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 5)} alt="当てはまる" /><span className="diagnosis-label">そう思わない</span></div>
            </div>
          </div>
        ))}
        <button className="diagnosis-next-btn" onClick={handleNext} disabled={!currentQuestions.every(q => answers[q.id])}>{page === totalPages ? '結果を見る' : '次へ'}</button>
      </div>
    </div>
  );
};

export default Diagnosis;