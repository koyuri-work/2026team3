import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { IMAGES, KEY_MAPPING, TYPE_IMAGES, TYPE_DISPLAY_NAMES } from '../constants';
import './Home.css';

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
    <div className="app-container">
      <div className="home-screen">
        <div className="home-screen-before" style={{ backgroundImage: `url(${IMAGES.hosizoraImg})` }}></div>
        <div className="home-menu" onClick={() => setShowMenu(!showMenu)}>
          <span className="home-menu-span"></span><span className="home-menu-span"></span><span className="home-menu-span"></span>
        </div>
        {showMenu && (
          <div style={{ position: 'absolute', top: '50px', right: '24px', background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 30 }}>
            <button onClick={handleLogout} style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '12px', border: 'none', cursor: 'pointer', margin: 0 }}>ログアウト</button>
          </div>
        )}
        <div className="home-puzzle-wrapper">
          <div className="home-puzzle">
            <img src={(latestType && TYPE_IMAGES[latestType]) || IMAGES.homeImg} className="home-puzzle-img" alt="Diagnosis Type" />
          </div>
        </div>
        <div className="home-title">{latestType ? TYPE_DISPLAY_NAMES[latestType] : '性格診断'}</div>
        <div className="home-cards">
          <Link to="/diagnosis/self" className="home-card">
            <div className="home-icon-base"><img src={IMAGES.puzzleIcon} alt="ひとりで" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p className="home-card-text">ひとりで</p>
          </Link>
          <Link to="/friend-select" className="home-card">
            <div className="home-icon-base"><img src={IMAGES.multiIcon} alt="みんなで" style={{width: '81px', height: '81px', objectFit: 'contain'}} /></div>
            <p className="home-card-text">みんなで</p>
          </Link>
          <Link to="/history" className="home-card">
            <div style={{...{ width: '60px', height: '60px', borderRadius: '8px', position: 'relative', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateY(-5px)' }, borderRadius: '50%'}}><img src={IMAGES.historyIcon} alt="履歴" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p className="home-card-text">履歴</p>
          </Link>
          <Link to="/friends" className="home-card">
            <div style={{...{ width: '60px', height: '60px', borderRadius: '8px', position: 'relative', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateY(-5px)' }, borderRadius: '50%'}}><img src={IMAGES.friendIcon} alt="友達登録" style={{width: '54px', height: '54px', objectFit: 'contain'}} /></div>
            <p className="home-card-text">友達登録</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;