import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import { QUESTIONS, DIAGNOSIS_TYPES } from './questions';
import { supabase } from './supabaseClient';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// 画像のインポート
import puzzleIcon from './assets/self.png';
import multiIcon from './assets/each.png';
import historyIcon from './assets/history.png';
import friendIcon from './assets/friends.png';
import leftImg from './assets/left.png';
import sLeftImg from './assets/s-left.png';
import midImg from './assets/mid.png';
import sRightImg from './assets/s-right.png';
import rightImg from './assets/right.png';
import homeImg from './assets/home.png';
import home2Img from './assets/home2.png';
import hosizoraImg from './assets/hosizora.png';
import yoakemaeImg from './assets/yoakemae.png';
import akegataImg from './assets/akegata.png';
import soutyouImg from './assets/soutyou.png';
import gozentyuuImg from './assets/gozentyuu.png';
import mahiruImg from './assets/mahiru.png';
import hakutyuuImg from './assets/hakutyuu.png';
import hirusagariImg from './assets/hirusagari.png';
import yugataImg from './assets/yuugata.png';
import higureImg from './assets/higure.png';
import yohukeImg from './assets/yohuke.png';
import mayonakaImg from './assets/mayonaka.png';
import sinyaImg from './assets/sinya.png';

// --- スタイル定義 ---
const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  button: { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', border: 'none', cursor: 'pointer' },
  secondaryButton: { display: 'inline-block', padding: '10px 20px', marginTop: '20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '14px', border: 'none', cursor: 'pointer' },
  optionButton: { display: 'block', width: '100%', padding: '12px', margin: '8px 0', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' },
  input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '15px' },
  title: { color: '#333', marginBottom: '30px' }
};

const authStyles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000', fontFamily: '"Georgia", serif' },
  screen: { width: '100%', maxWidth: '375px', height: '100vh', maxHeight: '812px', backgroundColor: '#f6f6f6', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 0 20px rgba(255,255,255,0.1)' },
  topWave: { position: 'absolute', top: '-80px', right: '-100px', width: '500px', height: '300px', backgroundColor: '#4b4b5f', borderBottomLeftRadius: '300px', zIndex: 1 },
  circle: { position: 'absolute', top: '170px', left: '50%', transform: 'translateX(-50%)', width: '230px', height: '230px', borderRadius: '50%', background: 'radial-gradient(circle at top left, #cfc8ff, #f5b8cc)', zIndex: 2, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' },
  title: { position: 'absolute', top: '245px', left: '60px', fontSize: '34px', letterSpacing: '3px', color: '#2d2d5a', zIndex: 3, fontWeight: 'bold' },
  puzzleBig: { position: 'absolute', top: '300px', right: '40px', width: '120px', height: '120px', zIndex: 2, objectFit: 'contain', filter: 'drop-shadow(-6px -6px 5px rgba(0,0,0,0.2))' },
  puzzleSmall: { position: 'absolute', top: '180px', right: '100px', width: '60px', height: '60px', zIndex: 2, objectFit: 'contain', filter: 'drop-shadow(-6px 6px 5px rgba(0,0,0,0.2))' },
  formContainer: { position: 'absolute', bottom: '80px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', zIndex: 10 },
  input: { width: '260px', height: '44px', borderRadius: '22px', background: '#fff', border: 'none', paddingLeft: '20px', color: '#555', fontSize: '14px', boxShadow: '0 3px 6px rgba(0,0,0,0.08)', outline: 'none', boxSizing: 'border-box', fontFamily: '"Georgia", serif' },
  submitButton: { width: '260px', height: '44px', borderRadius: '22px', background: 'linear-gradient(to right, #aa92f8, #c4b3ff)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '14px', border: 'none', cursor: 'pointer', fontFamily: '"Georgia", serif', boxShadow: '0 3px 6px rgba(0,0,0,0.2)', fontWeight: 'bold' },
  divider: { display: 'flex', alignItems: 'center', width: '260px', margin: '5px 0' },
  line: { flex: 1, height: '1px', background: '#aaa' },
  orText: { fontSize: '13px', color: '#777', padding: '0 10px' },
  toggleButton: { background: 'none', border: 'none', color: '#777', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', fontFamily: '"Georgia", serif' },
  errorMsg: { color: '#d9534f', fontSize: '12px', textAlign: 'center', width: '260px', marginBottom: '5px' }
};

const homeStyles = {
  wrapper: { display: 'flex', justifyContent: 'center', backgroundColor: '#000', minHeight: '100vh', fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' },
  screen: { width: '100%', maxWidth: '375px', minHeight: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #201938, #9a8fd0)', overflow: 'hidden' }, // ← ここで背景グラデーションを設定しています
  screenBefore: { position: 'absolute', top: '-50%', left: 0, right: 0, bottom: '50%', backgroundImage: `url(${hosizoraImg})`, backgroundSize: 'cover', backgroundPosition: 'bottom', pointerEvents: 'none' },
  menu: { position: 'absolute', top: '40px', right: '24px', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', zIndex: 20 },
  menuSpan: { width: '24px', height: '3px', background: '#ddd', borderRadius: '3px' },
  puzzleWrapper: { position: 'absolute', top: '140px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, cursor: 'pointer' },
  puzzle: { width: '210px', height: '210px', position: 'relative', filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  puzzleImg: { width: '100%', height: '100%', objectFit: 'contain' },
  title: { position: 'absolute', top: '380px', width: '100%', textAlign: 'center', color: 'white', fontSize: '20px', letterSpacing: '2px', zIndex: 10, fontWeight: 'bold', cursor: 'pointer' },
  cards: { position: 'absolute', bottom: '60px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', padding: '0 32px', boxSizing: 'border-box', zIndex: 10 },
  card: { height: '140px', background: '#d6d3eb', borderRadius: '28px', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none', position: 'relative', paddingTop: '30px', boxSizing: 'border-box' },
  cardText: { marginTop: '12px', fontSize: '14px', color: '#5e4f9a', fontWeight: 'bold', transform: 'translateY(-15px)' },
  iconBase: { width: '60px', height: '60px', borderRadius: '8px', position: 'relative', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateY(-5px)' },
};

// --- コンポーネント定義 ---

const KEY_MAPPING = {
  reimei: 'yoakemae',
  shinonome: 'akegata',
  asanagi: 'soutyou',
  socho: 'soutyou',
  choko: 'gozentyuu',
  hiutsuri: 'mahiru',
  hakuchu: 'hakutyuu',
  hakubo: 'hirusagari',
  gorei: 'yugata',
  tasogare: 'higure',
  yunagi: 'yohuke',
  yofuke: 'yohuke',
  yoiyami: 'mayonaka',
  ushimitsu: 'sinya',
  shinya: 'sinya'
};

const TYPE_IMAGES = {
  yoakemae: yoakemaeImg,
  akegata: akegataImg,
  soutyou: soutyouImg,
  gozentyuu: gozentyuuImg,
  mahiru: mahiruImg,
  hakutyuu: hakutyuuImg,
  hirusagari: hirusagariImg,
  yugata: yugataImg,
  higure: higureImg,
  yohuke: yohukeImg,
  mayonaka: mayonakaImg,
  sinya: sinyaImg,
};

const TYPE_DISPLAY_NAMES = {
  mayonaka: '真夜中タイプ',
  sinya: '深夜タイプ',
  yoakemae: '夜明け前タイプ',
  akegata: '明け方タイプ',
  soutyou: '早朝タイプ',
  gozentyuu: '午前中タイプ',
  mahiru: '真昼タイプ',
  hakutyuu: '白昼タイプ',
  hirusagari: '昼下がりタイプ',
  yugata: '夕方タイプ',
  higure: '日暮れタイプ',
  yohuke: '夜更けタイプ',
};

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [searchId, setSearchId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email, password, options: { data: { username, search_id: searchId } },
        });
        if (error) throw error;
        setMessage('登録確認メールを送信しました！');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };

  return (
    <div style={authStyles.wrapper}>
      <div style={authStyles.screen}>
        <div style={authStyles.topWave}></div>
        <div style={authStyles.circle}></div>
        <div style={authStyles.title}>{isSignUp ? 'SIGN UP' : 'LOG IN'}</div>
        <img src={home2Img} style={authStyles.puzzleSmall} alt="" />
        <img src={homeImg} style={authStyles.puzzleBig} alt="" />
        <form onSubmit={handleAuth} style={authStyles.formContainer}>
          {isSignUp && (
            <>
              <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} style={authStyles.input} required />
              <input type="text" placeholder="検索用ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} style={authStyles.input} required />
            </>
          )}
          <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} style={authStyles.input} required />
          <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} style={authStyles.input} required />
          {message && <p style={authStyles.errorMsg}>{message}</p>}
          <button type="submit" style={authStyles.submitButton} disabled={loading}>{loading ? '処理中...' : (isSignUp ? '登録する' : 'サインイン')}</button>
          <div style={authStyles.divider}>
            <div style={authStyles.line}></div>
            <span style={authStyles.orText}>or</span>
            <div style={authStyles.line}></div>
          </div>
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }} style={authStyles.toggleButton}>
            {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Home = ({ session }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [latestType, setLatestType] = useState(null);
  const [latestScores, setLatestScores] = useState(null);
  const navigate = useNavigate();
  const handleLogout = async () => { await supabase.auth.signOut(); };

  useEffect(() => {
    if (!session) return;
    const fetchLatestDiagnosis = async () => {
      const { data } = await supabase
        .from('diagnosis_results')
        .select('result_key, scores')
        .eq('target_user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        const key = data[0].result_key;
        setLatestType(KEY_MAPPING[key] || key);
        setLatestScores(data[0].scores);
      }
    };
    fetchLatestDiagnosis();
  }, [session]);

  const handleResultClick = () => {
    if (latestType && latestScores) {
      navigate('/result', { state: { resultKey: latestType, scores: latestScores } });
    }
  };

  return (
    <div style={homeStyles.wrapper}>
      <div style={homeStyles.screen}>
        <div style={homeStyles.screenBefore}></div>
        <div style={homeStyles.menu} onClick={() => setShowMenu(!showMenu)}>
          <span style={homeStyles.menuSpan}></span><span style={homeStyles.menuSpan}></span><span style={homeStyles.menuSpan}></span>
        </div>
        {showMenu && (
          <div style={{ position: 'absolute', top: '50px', right: '24px', background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 30 }}>
            <button onClick={handleLogout} style={{...styles.secondaryButton, margin: 0, fontSize: '12px'}}>ログアウト</button>
          </div>
        )}
        <div style={homeStyles.puzzleWrapper} onClick={handleResultClick}>
          <div style={homeStyles.puzzle}>
            <img src={(latestType && TYPE_IMAGES[latestType]) || homeImg} style={homeStyles.puzzleImg} alt="Diagnosis Type" />
          </div>
        </div>
        <div style={homeStyles.title} onClick={handleResultClick}>{latestType ? TYPE_DISPLAY_NAMES[latestType] : '性格診断'}</div>
        <div style={homeStyles.cards}>
          <Link to="/diagnosis/self" style={homeStyles.card}>
            <div style={homeStyles.iconBase}><img src={puzzleIcon} alt="ひとりで" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p style={homeStyles.cardText}>ひとりで</p>
          </Link>
          <Link to="/diagnosis/friend" style={homeStyles.card}>
            <div style={homeStyles.iconBase}><img src={multiIcon} alt="みんなで" style={{width: '81px', height: '81px', objectFit: 'contain'}} /></div>
            <p style={homeStyles.cardText}>みんなで</p>
          </Link>
          <Link to="/history" style={homeStyles.card}>
            <div style={{...homeStyles.iconBase, borderRadius: '50%'}}><img src={historyIcon} alt="履歴" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p style={homeStyles.cardText}>履歴</p>
          </Link>
          <Link to="/friends" style={homeStyles.card}>
            <div style={{...homeStyles.iconBase, borderRadius: '50%'}}><img src={friendIcon} alt="友達登録" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p style={homeStyles.cardText}>友達登録</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const DiagnosisRadar = ({ scores }) => {
  const data = [
    { subject: '開放性(O)', A: scores.O || 0, fullMark: 5 },
    { subject: '誠実性(C)', A: scores.C || 0, fullMark: 5 },
    { subject: '外向性(E)', A: scores.E || 0, fullMark: 5 },
    { subject: '協調性(A)', A: scores.A || 0, fullMark: 5 },
    { subject: '神経症(N)', A: scores.N || 0, fullMark: 5 },
  ];
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} /><PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
          <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const FriendSystem = ({ session }) => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase.from('friendships').select(`id, status, profiles:user_id (username, search_id)`).eq('friend_id', session.user.id).eq('status', 'pending');
      if (error) throw error;
      setRequests(data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (session) fetchRequests(); }, [session]);

  const searchUser = async () => {
    setMessage(''); setSearchResult(null);
    const { data, error } = await supabase.from('profiles').select('*').eq('search_id', searchId).single();
    if (error || !data) setMessage('ユーザーが見つかりませんでした。');
    else setSearchResult(data);
  };

  const addFriend = async (friendId) => {
    try {
      const { error } = await supabase.from('friendships').insert({ user_id: session.user.id, friend_id: friendId, status: 'pending' });
      if (error) throw error;
      setMessage('申請を送りました！'); setSearchResult(null); setSearchId('');
    } catch (err) { setMessage('申請に失敗しました。'); }
  };

  const acceptFriend = async (friendshipId) => {
    try {
      const { error } = await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
      if (error) throw error;
      setMessage('承認しました！'); fetchRequests();
    } catch (err) { setMessage('失敗しました。'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>フレンド検索</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="友達のID" value={searchId} onChange={(e) => setSearchId(e.target.value)} style={styles.input} />
          <button onClick={searchUser} style={{...styles.button, width: '100px'}}>検索</button>
        </div>
        {message && <p>{message}</p>}
        {searchResult && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee' }}>
            <p><strong>{searchResult.username}</strong> さん</p>
            <button onClick={() => addFriend(searchResult.id)} style={{...styles.button, backgroundColor: '#28a745'}}>申請する</button>
          </div>
        )}
        <hr />
        <h3>届いているリクエスト</h3>
        {requests.map((req) => (
          <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <span><strong>{req.profiles.username}</strong></span>
            <button onClick={() => acceptFriend(req.id)} style={{...styles.button, width: 'auto', backgroundColor: '#28a745'}}>承認</button>
          </div>
        ))}
      </div>
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

const determineType = (scores) => {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const first = entries[0];
  const isMid = (val) => val >= 2.7 && val <= 3.69;
  if (entries.every(([_, val]) => isMid(val))) return 'soutyou';
  if (scores['O'] >= 3.7 && scores['E'] <= 2.69) return 'akegata';
  if (scores['O'] >= 3.7 && scores['C'] <= 2.69) return 'mahiru';
  if (scores['E'] >= 3.7 && scores['C'] <= 2.69) return 'hirusagari';
  if (scores['A'] >= 3.7 && scores['E'] <= 2.69) return 'higure';
  const top2 = [entries[0][0], entries[1][0]];
  const has = (f1, f2) => top2.includes(f1) && top2.includes(f2);
  if (has('O', 'E')) return 'yoakemae';
  if (has('O', 'C')) return 'gozentyuu';
  if (has('E', 'C')) return 'hakutyuu';
  if (has('A', 'E')) return 'yugata';
  if (has('C', 'A')) return 'yohuke';
  if (has('N', 'O')) return 'mayonaka';
  if (has('N', 'C')) return 'sinya';
  switch (first[0]) {
    case 'O': return 'yoakemae'; case 'C': return 'gozentyuu'; case 'E': return 'hakutyuu'; case 'A': return 'yugata'; case 'N': return 'mayonaka'; default: return 'soutyou';
  }
};

const Diagnosis = ({ session }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState({});

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
      window.scrollTo(0, 0);
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
        target_user_id: session.user.id, created_by: session.user.id, result_key: resultTypeKey, scores: { ...averageScores, diagnosis_type: type }
      });
    }
    navigate('/result', { state: { resultKey: resultTypeKey, scores: averageScores } });
  };

  return (
    <div className="diagnosis-screen">
      <div className="diagnosis-header">
        <div className="diagnosis-back" onClick={() => page > 1 ? setPage(page - 1) : navigate(-1)}></div>
        <div className="diagnosis-menu">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div className="diagnosis-subtitle">あなたへの質問</div>
      <div className="diagnosis-title">Question {page}/{totalPages}</div>

      <div className="diagnosis-card">
        {currentQuestions.map((q) => (
          <div key={q.id} className="diagnosis-question-item">
            <p>{q.text}</p>
            <div className="diagnosis-choices">
              <img src={leftImg} className={`diagnosis-img diagnosis-img-1 ${answers[q.id] === 1 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 1)} alt="当てはまらない" />
              <img src={sLeftImg} className={`diagnosis-img diagnosis-img-2 ${answers[q.id] === 2 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 2)} alt="あまり当てはまらない" />
              <img src={midImg} className={`diagnosis-img diagnosis-img-3 ${answers[q.id] === 3 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 3)} alt="どちらともいえない" />
              <img src={sRightImg} className={`diagnosis-img diagnosis-img-4 ${answers[q.id] === 4 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 4)} alt="やや当てはまる" />
              <img src={rightImg} className={`diagnosis-img diagnosis-img-5 ${answers[q.id] === 5 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 5)} alt="当てはまる" />
            </div>
          </div>
        ))}
        <button className="diagnosis-next-btn" onClick={handleNext} disabled={!currentQuestions.every(q => answers[q.id])}>
          {page === totalPages ? '結果を見る' : '次へ'}
        </button>
      </div>
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const { resultKey, scores } = location.state || { resultKey: 'soutyou', scores: {} };
  const normalizedKey = KEY_MAPPING[resultKey] || resultKey;
  const resultData = DIAGNOSIS_TYPES[normalizedKey] || DIAGNOSIS_TYPES['soutyou'];
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>診断結果: {TYPE_DISPLAY_NAMES[normalizedKey] || resultData.name}</h2>
        {scores && <DiagnosisRadar scores={scores} />}
        <p>{resultData.description}</p>
      </div>
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

const History = ({ session }) => {
  const [historyData, setHistoryData] = useState([]);
  useEffect(() => {
    if (!session) return;
    const fetchHistory = async () => {
      const { data } = await supabase.from('diagnosis_results').select('*').eq('target_user_id', session.user.id).order('created_at', { ascending: false });
      if (data) setHistoryData(data);
    };
    fetchHistory();
  }, [session]);

  return (
    <div style={styles.container}>
      <h2>履歴</h2>
      {historyData.map(item => {
        const normalizedKey = KEY_MAPPING[item.result_key] || item.result_key;
        return (
          <div key={item.id} style={styles.card}>
            <p>{new Date(item.created_at).toLocaleDateString()}</p>
            <p>{TYPE_DISPLAY_NAMES[normalizedKey] || DIAGNOSIS_TYPES[normalizedKey]?.name}</p>
            <DiagnosisRadar scores={item.scores} />
          </div>
        );
      })}
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/diagnosis/:type" element={<Diagnosis session={session} />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History session={session} />} />
        <Route path="/friends" element={<FriendSystem session={session} />} />
      </Routes>
    </Router>
  );
}

export default App;