import { useState, useEffect, useRef } from 'react';
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
  formContainer: { position: 'absolute', bottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', zIndex: 10 },
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
  puzzleWrapper: { position: 'absolute', top: '70px', left: '45%', transform: 'translateX(-50%)', zIndex: 10 },
  puzzle: { width: '210px', height: '210px', position: 'relative', filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  puzzleImg: { width: '100%', height: '100%', objectFit: 'contain' },
  title: { position: 'absolute', top: '300px', width: '100%', textAlign: 'center', color: 'white', fontSize: '20px', letterSpacing: '2px', zIndex: 10, fontWeight: 'bold' },
  cards: { position: 'absolute', bottom: '40px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', padding: '0 32px', boxSizing: 'border-box', zIndex: 10 },
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

const TYPE_HOURS = {
  yoakemae: 4,
  akegata: 6,
  soutyou: 8,
  gozentyuu: 10,
  mahiru: 12,
  hakutyuu: 14,
  hirusagari: 16,
  yugata: 18,
  higure: 20,
  yohuke: 22,
  mayonaka: 0,
  sinya: 2,
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
  const navigate = useNavigate();
  const handleLogout = async () => { await supabase.auth.signOut(); };

  useEffect(() => {
    if (!session) return;
    const fetchLatestDiagnosis = async () => {
      const { data } = await supabase
        .from('diagnosis_results')
        .select('result_key')
        .eq('target_user_id', session.user.id)
        .eq('created_by', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        const key = data[0].result_key;
        setLatestType(KEY_MAPPING[key] || key);
      }
    };
    fetchLatestDiagnosis();
  }, [session]);

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
        <div style={homeStyles.puzzleWrapper}>
          <div style={homeStyles.puzzle}>
            <img src={(latestType && TYPE_IMAGES[latestType]) || homeImg} style={homeStyles.puzzleImg} alt="Diagnosis Type" />
          </div>
        </div>
        <div style={homeStyles.title}>{latestType ? TYPE_DISPLAY_NAMES[latestType] : '性格診断'}</div>
        <div style={homeStyles.cards}>
          <Link to="/diagnosis/self" style={homeStyles.card}>
            <div style={homeStyles.iconBase}><img src={puzzleIcon} alt="ひとりで" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p style={homeStyles.cardText}>ひとりで</p>
          </Link>
          <Link to="/friend-select" style={homeStyles.card}>
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
          <PolarGrid stroke="#fff" /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'white' }} />
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
  const navigate = useNavigate();

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
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('search_id', searchId).single();
    if (error || !profile) {
      setMessage('ユーザーが見つかりませんでした。');
      return;
    }

    const { data: friendship } = await supabase
      .from('friendships')
      .select('status')
      .or(`and(user_id.eq.${session.user.id},friend_id.eq.${profile.id}),and(user_id.eq.${profile.id},friend_id.eq.${session.user.id})`)
      .maybeSingle();

    setSearchResult({ ...profile, friendshipStatus: friendship ? friendship.status : null });
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
    <div style={homeStyles.wrapper}>
      <div className="friend-screen">
        <div className="compare-home" onClick={() => navigate('/')} style={{ top: '50px', zIndex: 20 }}></div>
        <div className="friend-content">
          <h1>フレンド追加</h1>
          <p>相手の検索IDを入力してください</p>

          <div className="search-box">
            <input type="text" placeholder="検索用ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
            <div className="search-icon" onClick={searchUser}></div>
          </div>
          {message && <p>{message}</p>}

          {searchResult && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#eee', borderRadius: '10px', color: '#333', width: '280px', margin: '20px auto' }}>
              <p style={{ fontSize: '1.1em', color: '#000' }}><strong>{searchResult.username}</strong> さん</p>
              {searchResult.id === session.user.id ? (
                <p style={{ fontSize: '12px', color: '#666' }}>自分自身です</p>
              ) : searchResult.friendshipStatus === 'accepted' ? (
                <p style={{ fontSize: '12px', color: '#666' }}>既につながっています</p>
              ) : searchResult.friendshipStatus === 'pending' ? (
                <p style={{ fontSize: '12px', color: '#666' }}>申請中または承認待ちです</p>
              ) : (
                <button onClick={() => addFriend(searchResult.id)} style={{ ...styles.button, backgroundColor: '#8c7dc8' }}>申請する</button>
              )}
            </div>
          )}

          <div style={{ marginTop: '30px', width: '90%', margin: '30px auto' }}>
            {requests.length > 0 && <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>届いているリクエスト</h3>}
            {requests.map((req) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'white', marginBottom: '10px', borderRadius: '8px', color: '#333' }}>
                <span><strong>{req.profiles.username}</strong></span>
                <button onClick={() => acceptFriend(req.id)} style={{ ...styles.button, width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: '#28a745', fontSize: '12px' }}>承認</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FriendSelect = ({ session }) => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;
    const fetchFriends = async () => {
      const { data: sent } = await supabase
        .from('friendships')
        .select('friend_id, status, profiles:friend_id(username, id)')
        .eq('user_id', session.user.id)
        .in('status', ['accepted', 'pending']);

      const { data: received } = await supabase
        .from('friendships')
        .select('user_id, status, profiles:user_id(username, id)')
        .eq('friend_id', session.user.id)
        .in('status', ['accepted', 'pending']);

      const formattedSent = (sent || []).map(f => ({ ...f.profiles, id: f.friend_id, status: f.status }));
      const formattedReceived = (received || []).map(f => ({ ...f.profiles, id: f.user_id, status: f.status }));
      setFriends([...formattedSent, ...formattedReceived]);
    };
    fetchFriends();
  }, [session]);

  return (
    <div style={homeStyles.wrapper}>
      <div className="friend-screen">
        <div className="compare-home" onClick={() => navigate('/')} style={{ top: '50px', zIndex: 20 }}></div>
        <div className="friend-content">
          <h1>友達を選択</h1>
          <p>診断する友達を選んでください</p>
          <div style={{ marginTop: '20px', width: '90%', margin: '20px auto', maxHeight: '500px', overflowY: 'auto' }}>
            {friends.map(friend => (
              <div key={friend.id} style={{ padding: '15px', background: 'white', marginBottom: '10px', borderRadius: '10px', color: '#333', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{friend.username} さん</strong>
                {friend.status === 'accepted' ? (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => navigate('/diagnosis/friend', { state: { targetFriend: friend } })} style={{...styles.button, width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: 'transparent', border: '1px solid #8c7dc8', color: '#8c7dc8', fontSize: '12px'}}>診断する</button>
                    <button onClick={() => navigate('/history', { state: { targetFriend: friend } })} style={{...styles.button, width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: '#8c7dc8', color: 'white', fontSize: '12px'}}>結果を見る</button>
                  </div>
                ) : (
                  <span style={{fontSize: '12px', color: '#888'}}>承認待ち</span>
                )}
              </div>
            ))}
            {friends.length === 0 && <p>友達がいません</p>}
          </div>
          <Link to="/friends" style={{...styles.button, backgroundColor: '#8c7dc8', width: '200px', margin: '20px auto', display: 'block', color: 'white', textDecoration: 'none', borderRadius: '20px', textAlign: 'center', padding: '10px 0', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>友達を追加する</Link>
        </div>
      </div>
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
              <div className="diagnosis-choice-wrapper">
                <img src={leftImg} className={`diagnosis-img diagnosis-img-1 ${answers[q.id] === 1 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 1)} alt="当てはまらない" />
                <span className="diagnosis-label">そう思う</span>
              </div>
              <img src={sLeftImg} className={`diagnosis-img diagnosis-img-2 ${answers[q.id] === 2 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 2)} alt="あまり当てはまらない" />
              <img src={midImg} className={`diagnosis-img diagnosis-img-3 ${answers[q.id] === 3 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 3)} alt="どちらともいえない" />
              <img src={sRightImg} className={`diagnosis-img diagnosis-img-4 ${answers[q.id] === 4 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 4)} alt="やや当てはまる" />
              <div className="diagnosis-choice-wrapper">
                <img src={rightImg} className={`diagnosis-img diagnosis-img-5 ${answers[q.id] === 5 ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, 5)} alt="当てはまる" />
                <span className="diagnosis-label">そう思わない</span>
              </div>
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
  const navigate = useNavigate();
  const { resultKey, scores, date, isMine, friendName } = location.state || { resultKey: 'soutyou', scores: {}, date: null, isMine: true, friendName: '' };
  const normalizedKey = KEY_MAPPING[resultKey] || resultKey;
  const resultData = DIAGNOSIS_TYPES[normalizedKey] || DIAGNOSIS_TYPES['soutyou'];
  const resultImage = TYPE_IMAGES[normalizedKey] || homeImg;

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

const History = ({ session }) => {
  const [historyData, setHistoryData] = useState([]);
  const [status, setStatus] = useState('loading'); // loading, animating, results, coming_soon
  const [animImages, setAnimImages] = useState({ left: null, right: null });
  const navigate = useNavigate();
  const location = useLocation();
  const targetFriend = location.state?.targetFriend;

  useEffect(() => {
    if (!session) return;
    const fetchHistory = async () => {
      if (targetFriend) {
        const { data: fromFriend } = await supabase
          .from('diagnosis_results')
          .select('*, profiles:created_by(username, search_id)')
          .eq('target_user_id', session.user.id)
          .eq('created_by', targetFriend.id)
          .order('created_at', { ascending: false });

        const { data: mySelf } = await supabase
          .from('diagnosis_results')
          .select('*, profiles:created_by(username, search_id)')
          .eq('target_user_id', session.user.id)
          .eq('created_by', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fromFriend && fromFriend.length > 0 && mySelf && mySelf.length > 0) {
          const combined = [
            ...(mySelf || []).map(d => ({ ...d, label: '自分の最新診断' })),
            ...(fromFriend || []).map(d => ({ ...d, label: `${targetFriend.username} さんからの診断` }))
          ];
          setHistoryData(combined);

          const myKey = mySelf[0].result_key;
          const friendKey = fromFriend[0].result_key;
          const leftImg = TYPE_IMAGES[KEY_MAPPING[myKey] || myKey] || homeImg;
          const rightImg = TYPE_IMAGES[KEY_MAPPING[friendKey] || friendKey] || homeImg;
          setAnimImages({ left: leftImg, right: rightImg });

          setStatus('animating');
          setTimeout(() => {
            setStatus('results');
          }, 2500);
        } else {
          setStatus('coming_soon');
        }
      } else {
        const { data } = await supabase.from('diagnosis_results').select('*, profiles:created_by(username, search_id)').eq('target_user_id', session.user.id).order('created_at', { ascending: false });
        if (data) setHistoryData(data);
        setStatus('results');
      }
    };
    fetchHistory();
  }, [session, targetFriend]);

  if (status === 'loading') return <div style={styles.container}>Loading...</div>;

  if (status === 'coming_soon') {
    return (
      <div style={homeStyles.wrapper}>
        <div className="friend-screen">
          <div className="coming-soon-content">
            <h1 style={{ fontSize: '32px', marginBottom: '10px', letterSpacing: '2px' }}>Coming Soon</h1>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>お互いの診断が揃うまでお待ちください</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'animating') {
    return (
      <div className="animation-overlay">
        <img src={animImages.left} className="merge-icon left" alt="self" />
        <img src={animImages.right} className="merge-icon right" alt="friend" />
      </div>
    );
  }

  // 比較画面（結果表示）
  if (targetFriend && historyData.length === 2) {
    const myData = historyData[0]; // 自分の診断 (Me -> Me)
    const friendData = historyData[1]; // フレンドからの診断 (Friend -> Me)

    const myKey = KEY_MAPPING[myData.result_key] || myData.result_key;
    const friendKey = KEY_MAPPING[friendData.result_key] || friendData.result_key;

    const myHour = TYPE_HOURS[myKey] !== undefined ? TYPE_HOURS[myKey] : 0;
    const friendHour = TYPE_HOURS[friendKey] !== undefined ? TYPE_HOURS[friendKey] : 0;
    
    let timeDiff = Math.abs(myHour - friendHour);
    if (timeDiff > 12) timeDiff = 24 - timeDiff;

    const radarData = [
      { subject: '開放性', A: myData.scores.O, B: friendData.scores.O, fullMark: 5 },
      { subject: '誠実性', A: myData.scores.C, B: friendData.scores.C, fullMark: 5 },
      { subject: '外向性', A: myData.scores.E, B: friendData.scores.E, fullMark: 5 },
      { subject: '協調性', A: myData.scores.A, B: friendData.scores.A, fullMark: 5 },
      { subject: '神経症', A: myData.scores.N, B: friendData.scores.N, fullMark: 5 },
    ];

    return (
      <div className="compare-screen">
        <div className="compare-header">
          <div className="compare-home" onClick={() => navigate('/')}></div>
          <h1>2人の景色</h1>
        </div>

        <div className="compare-puzzle-area">
          <div style={{ display: 'flex', gap: '10px' }}>
            <img src={animImages.left} style={{ width: '160px', height: '160px', objectFit: 'contain', transform: 'translateX(23px)' }} alt="Me" />
            <img src={animImages.right} style={{ width: '160px', height: '160px', objectFit: 'contain', transform: 'translateX(-22px)' }} alt="Friend" />
          </div>
          <div className="compare-names">
            <div style={{ transform: 'translateX(25px)' }}>{session.user.user_metadata?.username || 'あなた'}<br /><span>（あなた）</span></div>
            <div style={{ transform: 'translateX(5px)' }}>{targetFriend.username}<br /><span>（友達）</span></div>
          </div>
        </div>

        <div className="compare-bottom-card">
          <h2>二人のズレ</h2>
          <div className="compare-time-title">
            {timeDiff}時間
            <div className="compare-underline"></div>
          </div>

          <div className="compare-radar">
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#666' }} />
                <Radar name="Me" dataKey="A" stroke="#5078ff" fill="#5078ff" fillOpacity={0.4} />
                <Radar name="Friend" dataKey="B" stroke="#ff78a0" fill="#ff78a0" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="compare-result-cards">
            <div className="compare-result" style={{ background: '#d6d3eb' }}> {/* 青っぽい背景に変更 */}
              あなたから見た<br />あなた
              <div className="compare-type">{TYPE_DISPLAY_NAMES[myKey]}</div>
            </div>
            <div className="compare-result">
              {targetFriend.username}さんから見た<br />あなた
              <div className="compare-type">{TYPE_DISPLAY_NAMES[friendKey]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <div className="history-back" onClick={() => navigate('/')}></div>
        <h1>友達との景色を見る</h1>
      </div>

      <div className="history-frame">
        <div className="history-puzzle-wrapper">
          {historyData.map((item) => {
            const normalizedKey = KEY_MAPPING[item.result_key] || item.result_key;
            const img = TYPE_IMAGES[normalizedKey] || homeImg;
            return (
              <img
                key={item.id}
                src={img}
                className="history-puzzle-item"
                alt="history"
                onClick={() => navigate('/result', { state: { resultKey: item.result_key, scores: item.scores, date: item.created_at, isMine: item.created_by === session.user.id, friendName: item.profiles?.username || item.profiles?.search_id || targetFriend?.username } })}
              />
            );
          })}
        </div>
        <div className="history-unfinished"></div>
      </div>
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
        <Route path="/friend-select" element={<FriendSelect session={session} />} />
      </Routes>
    </Router>
  );
}

export default App;