import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { IMAGES, KEY_MAPPING, TYPE_IMAGES, TYPE_DISPLAY_NAMES, TYPE_HOURS } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import './History.css';

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
          const leftImg = TYPE_IMAGES[KEY_MAPPING[myKey] || myKey] || IMAGES.homeImg;
          const rightImg = TYPE_IMAGES[KEY_MAPPING[friendKey] || friendKey] || IMAGES.homeImg;
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

  if (status === 'loading') return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  if (status === 'coming_soon') {
    return (
      <div className="app-container">
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
          <div style={{ display: 'flex', gap: '10px' }}><img src={animImages.left} style={{ width: '160px', height: '160px', objectFit: 'contain', transform: 'translateX(23px)' }} alt="Me" /><img src={animImages.right} style={{ width: '160px', height: '160px', objectFit: 'contain', transform: 'translateX(-22px)' }} alt="Friend" /></div>
          <div className="compare-names"><div style={{ transform: 'translateX(25px)' }}>{session.user.user_metadata?.username || 'あなた'}<br /><span>（あなた）</span></div><div style={{ transform: 'translateX(5px)' }}>{targetFriend.username}<br /><span>（友達）</span></div></div>
        </div>
        <div className="compare-bottom-card">
          <h2>二人のズレ</h2>
          <div className="compare-time-title">{timeDiff}時間<div className="compare-underline"></div></div>
          <div className="compare-radar"><ResponsiveContainer><RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}><PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#666' }} /><Radar name="Me" dataKey="A" stroke="#5078ff" fill="#5078ff" fillOpacity={0.4} /><Radar name="Friend" dataKey="B" stroke="#ff78a0" fill="#ff78a0" fillOpacity={0.4} /></RadarChart></ResponsiveContainer></div>
          <div className="compare-result-cards"><div className="compare-result" style={{ background: '#d6d3eb' }}>あなたから見た<br />あなた<div className="compare-type">{TYPE_DISPLAY_NAMES[myKey]}</div></div><div className="compare-result">{targetFriend.username}さんから見た<br />あなた<div className="compare-type">{TYPE_DISPLAY_NAMES[friendKey]}</div></div></div>
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
            const img = TYPE_IMAGES[normalizedKey] || IMAGES.homeImg;
            return <img key={item.id} src={img} className="history-puzzle-item" alt="history" onClick={() => navigate('/result', { state: { resultKey: item.result_key, scores: item.scores, date: item.created_at, isMine: item.created_by === session.user.id, friendName: item.profiles?.username || item.profiles?.search_id || targetFriend?.username } })} />;
          })}
        </div>
        <div className="history-unfinished"></div>
      </div>
    </div>
  );
};

export default History;