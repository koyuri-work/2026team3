import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import { QUESTIONS, DIAGNOSIS_TYPES } from './questions';
import { supabase } from './supabaseClient';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- スタイル定義 (簡易的なCSS) ---
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '10px 20px',
    marginTop: '20px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  },
  optionButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '15px',
  },
  title: {
    color: '#333',
    marginBottom: '30px',
  }
};

// --- 認証画面 (ログイン・サインアップ) ---
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
        // 新規登録: メタデータとしてユーザー名と検索IDを保存
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, search_id: searchId },
          },
        });
        if (error) throw error;
        setMessage('登録確認メールを送信しました。メールを確認してください！');
      } else {
        // ログイン
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isSignUp ? '新規登録' : 'ログイン'}</h1>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="検索用ID (例: yamada123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={styles.input}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '処理中...' : (isSignUp ? '登録する' : 'ログインする')}
          </button>
        </form>
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ ...styles.secondaryButton, marginTop: '10px', backgroundColor: 'transparent', color: '#007bff', textDecoration: 'underline' }}
        >
          {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら'}
        </button>
      </div>
    </div>
  );
};

// --- 1. ホーム画面 ---
const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // ログアウト後はAppコンポーネントの状態変化により自動的にAuth画面へ
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>診断アプリ</h1>
      
      <nav>
        <Link to="/diagnosis/friend" style={styles.button}>
          友達からの診断を受ける
        </Link>
        <Link to="/diagnosis/self" style={styles.button}>
          自分で診断する
        </Link>
        <Link to="/friends" style={{...styles.button, backgroundColor: '#6f42c1'}}>
          フレンド機能
        </Link>
        <Link to="/history" style={{...styles.button, backgroundColor: '#28a745'}}>
          過去の履歴を見る
        </Link>
        <button onClick={handleLogout} style={{...styles.secondaryButton, marginTop: '30px'}}>
          ログアウト
        </button>
      </nav>
    </div>
  );
};

// --- レーダーチャートコンポーネント ---
const DiagnosisRadar = ({ scores }) => {
  // チャート用にデータを変換
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
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
          <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- フレンド機能画面 ---
const FriendSystem = ({ session }) => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState('');

  // 届いているリクエスト一覧
  const [requests, setRequests] = useState([]);

  // リクエストを取得する関数
  const fetchRequests = async () => {
    try {
      // friendshipsテーブルから、自分がfriend_id（受信側）で、statusがpendingのものを取得
      // 同時に申請者(user_id)のプロフィール情報も取得する
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          profiles:user_id (username, search_id)
        `)
        .eq('friend_id', session.user.id)
        .eq('status', 'pending');

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('リクエスト取得エラー:', err);
    }
  };

  // 初回ロード時にリクエストを取得
  useEffect(() => {
    fetchRequests();
  }, [session]);

  const searchUser = async () => {
    setMessage('');
    setSearchResult(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('search_id', searchId)
        .single();

      if (error || !data) {
        setMessage('ユーザーが見つかりませんでした。');
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      setMessage('検索中にエラーが発生しました。');
    }
  };

  const addFriend = async (friendId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: session.user.id,
          friend_id: friendId,
          status: 'pending' // 申請中ステータス
        });

      if (error) throw error;
      setMessage('フレンド申請を送りました！');
      setSearchResult(null);
      setSearchId('');
    } catch (err) {
      setMessage('申請に失敗しました（すでに申請済みかもしれません）。');
    }
  };

  // フレンド承認処理
  const acceptFriend = async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;
      setMessage('フレンドを承認しました！');
      fetchRequests(); // リストを更新
    } catch (err) {
      setMessage('承認に失敗しました。');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>フレンド検索</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="友達のIDを入力"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={styles.input}
          />
          <button onClick={searchUser} style={{...styles.button, width: '100px', margin: '10px 0'}}>検索</button>
        </div>
        
        {message && <p style={{ color: '#666', marginTop: '10px' }}>{message}</p>}

        {searchResult && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <p><strong>{searchResult.username}</strong> さんが見つかりました</p>
            <button 
              onClick={() => addFriend(searchResult.id)}
              style={{...styles.button, backgroundColor: '#28a745', marginTop: '10px'}}
            >
              フレンド申請する
            </button>
          </div>
        )}

        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <h3 style={{ textAlign: 'left', fontSize: '18px' }}>届いているリクエスト</h3>
        {requests.length === 0 ? (
          <p style={{ textAlign: 'left', color: '#888' }}>現在リクエストはありません。</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{req.profiles.username}</strong> <span style={{fontSize: '12px', color: '#888'}}>({req.profiles.search_id})</span>
              </div>
              <button onClick={() => acceptFriend(req.id)} style={{...styles.button, width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: '#28a745'}}>
                承認
              </button>
            </div>
          ))
        )}
      </div>
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

// --- 2. 診断画面 (共通) ---
const Diagnosis = ({ session }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const title = type === 'friend' ? '友達からの診断' : '自己診断';
  
  // 現在の質問番号 (0始まり)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 回答データ: { questionId: score }
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // 回答処理
  const handleAnswer = (score) => {
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 診断完了 -> 結果計算へ
      finishDiagnosis(newAnswers);
    }
  };

  // 診断完了処理
  const finishDiagnosis = async (finalAnswers) => {
    // 1. スコア計算
    const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    
    QUESTIONS.forEach((q) => {
      let rawScore = finalAnswers[q.id];
      // 逆転項目の処理 (1<->5, 2<->4)
      const calculatedScore = q.isReverse ? (6 - rawScore) : rawScore;
      scores[q.factor] += calculatedScore;
    });

    // 平均値を算出 (各因子4問なので /4)
    const averageScores = {};
    Object.keys(scores).forEach(key => {
      averageScores[key] = scores[key] / 4;
    });

    // 2. タイプ判定
    const resultTypeKey = determineType(averageScores);

    // 3. 履歴保存 (Supabase)
    if (session) {
      try {
        await supabase.from('diagnosis_results').insert({
          target_user_id: session.user.id, // 今回は自分への診断として保存
          created_by: session.user.id,     // 診断した人（自分）
          result_key: resultTypeKey,
          scores: {
            ...averageScores,
            diagnosis_type: type // 'self' or 'friend' を記録
          }
        });
      } catch (error) {
        console.error('保存エラー:', error);
        alert('結果の保存に失敗しました');
      }
    }

    // 結果画面へ遷移 (stateで結果を渡す)
    navigate('/result', { state: { resultKey: resultTypeKey, scores: averageScores } });
  };

  // タイプ判定ロジック
  const determineType = (scores) => {
    // スコアが高い順にソート
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [first, second] = entries;
    
    // 判定基準
    const isHigh = (val) => val >= 3.7;
    const isLow = (val) => val <= 2.69;
    const isMid = (val) => val >= 2.7 && val <= 3.69;

    // 1. 朝凪（バランス型）: 全て中域
    if (entries.every(([_, val]) => isMid(val))) return 'asanagi';

    // 2. 特殊な組み合わせ (高 x 低)
    if (scores['O'] >= 3.7 && scores['E'] <= 2.69) return 'shinonome'; // 東雲
    if (scores['O'] >= 3.7 && scores['C'] <= 2.69) return 'hiutsuri'; // 日映
    if (scores['E'] >= 3.7 && scores['C'] <= 2.69) return 'hakubo'; // 薄暮
    if (scores['A'] >= 3.7 && scores['E'] <= 2.69) return 'tasogare'; // 黄昏

    // 3. 上位2因子による判定
    const top2 = [first[0], second[0]];
    const has = (f1, f2) => top2.includes(f1) && top2.includes(f2);

    if (has('O', 'E')) return 'reimei'; // 黎明
    if (has('O', 'C')) return 'choko'; // 朝光
    if (has('E', 'C')) return 'hakuchu'; // 白昼
    if (has('A', 'E')) return 'gorei'; // 午麗
    if (has('C', 'A')) return 'yunagi'; // 夕凪
    if (has('N', 'O')) return 'yoiyami'; // 宵闇
    if (has('N', 'C')) return 'ushimitsu'; // 丑三つ時

    // 4. 救済措置: 第1因子で決定
    switch (first[0]) {
      case 'O': return 'reimei';
      case 'C': return 'choko';
      case 'E': return 'hakuchu';
      case 'A': return 'gorei';
      case 'N': return 'yoiyami';
      default: return 'asanagi';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{fontSize: '18px', color: '#666'}}>{title} ({currentQuestionIndex + 1} / {QUESTIONS.length})</h2>
        <h3 style={{margin: '20px 0', fontSize: '20px'}}>{currentQuestion.text}</h3>
        
        <div style={{textAlign: 'left'}}>
          <button onClick={() => handleAnswer(5)} style={styles.optionButton}>5. とても当てはまる</button>
          <button onClick={() => handleAnswer(4)} style={styles.optionButton}>4. やや当てはまる</button>
          <button onClick={() => handleAnswer(3)} style={styles.optionButton}>3. どちらともいえない</button>
          <button onClick={() => handleAnswer(2)} style={styles.optionButton}>2. あまり当てはまらない</button>
          <button onClick={() => handleAnswer(1)} style={styles.optionButton}>1. まったく当てはまらない</button>
        </div>
      </div>
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

// --- 3. 診断結果画面 ---
const Result = () => {
  const location = useLocation();
  // 診断直後でない場合（直接アクセスなど）はホームに戻すなどの処理が必要ですが、今回は簡易表示
  const { resultKey } = location.state || { resultKey: 'asanagi' };
  const { scores } = location.state || { scores: {} };
  const resultData = DIAGNOSIS_TYPES[resultKey];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{color: '#e83e8c'}}>診断結果</h2>
        <p>あなたのタイプは...</p>
        <h3 style={{fontSize: '28px', margin: '15px 0', color: '#333'}}>{resultData.name}</h3>
        <h4 style={{color: '#007bff', marginBottom: '20px'}}>{resultData.title}</h4>
        
        {/* レーダーチャート表示 */}
        {scores && <DiagnosisRadar scores={scores} />}

        <p style={{lineHeight: '1.6', textAlign: 'left'}}>{resultData.description}</p>
      </div>
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

// --- 4. 履歴画面 ---
const History = ({ session }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session) return;
      
      const { data, error } = await supabase
        .from('diagnosis_results')
        .select('*')
        .eq('target_user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('履歴取得エラー:', error);
      } else {
        setHistoryData(data);
      }
    };
    fetchHistory();
  }, [session]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>過去の履歴</h2>
      {historyData.map((item) => (
        <div key={item.id} style={{...styles.card, textAlign: 'left'}}>
          <div style={{fontSize: '12px', color: '#888'}}>
            {new Date(item.created_at).toLocaleDateString()}
          </div>
          <div style={{fontWeight: 'bold', margin: '5px 0'}}>
            {item.scores?.diagnosis_type === 'friend' ? '友達からの診断' : '自己診断'}
          </div>
          
          {/* 履歴にも小さなチャートを表示 */}
          {item.scores && <DiagnosisRadar scores={item.scores} />}

          <div style={{color: '#e83e8c'}}>
            {DIAGNOSIS_TYPES[item.result_key] ? DIAGNOSIS_TYPES[item.result_key].name : '不明なタイプ'}
          </div>
        </div>
      ))}
      <Link to="/" style={styles.secondaryButton}>ホームに戻る</Link>
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 初回起動時のセッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ログイン状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ログインしていない場合は認証画面を表示
  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnosis/:type" element={<Diagnosis session={session} />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History session={session} />} />
        <Route path="/friends" element={<FriendSystem session={session} />} />
      </Routes>
    </Router>
  );
}

export default App
