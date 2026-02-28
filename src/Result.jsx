import { useNavigate, useLocation } from 'react-router-dom';
import { DIAGNOSIS_TYPES } from '../questions';
import { IMAGES, KEY_MAPPING, TYPE_IMAGES, TYPE_DISPLAY_NAMES } from '../constants';
import DiagnosisRadar from '../components/DiagnosisRadar';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultKey, scores, date, isMine, friendName } = location.state || { resultKey: 'soutyou', scores: {}, date: null, isMine: true, friendName: '' };
  const normalizedKey = KEY_MAPPING[resultKey] || resultKey;
  const resultData = DIAGNOSIS_TYPES[normalizedKey] || DIAGNOSIS_TYPES['soutyou'];
  const resultImage = TYPE_IMAGES[normalizedKey] || IMAGES.homeImg;

  return (
    <div className="result-screen">
      <div className="result-content">
        <div className="compare-home" onClick={() => navigate('/history')}></div>
        <p className="result-small-text">
          {date ? new Date(date).toLocaleDateString() : 'あなたは…'}
          {date && (isMine ? ' 自己診断' : ` ${friendName || '友達'}より`)}
        </p>
        <div className="result-puzzle">
          <img src={resultImage} className="result-puzzle-img" alt="result type" />
        </div>
        <div className="result-type-section">
          <h1>{TYPE_DISPLAY_NAMES[normalizedKey] || resultData.name}</h1>
          {scores && <DiagnosisRadar scores={scores} />}
          <div className="result-desc">
            <p>{resultData.description}</p>
          </div>
          <button className="result-main-btn" onClick={() => navigate('/friend-select')}>自分をみてもらう</button>
        </div>
      </div>
    </div>
  );
};

export default Result;