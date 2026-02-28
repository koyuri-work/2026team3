import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Friend.css';

const FriendSelect = ({ session }) => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;
    const fetchFriends = async () => {
      const { data: sent } = await supabase.from('friendships').select('friend_id, status, profiles:friend_id(username, id)').eq('user_id', session.user.id).in('status', ['accepted', 'pending']);
      const { data: received } = await supabase.from('friendships').select('user_id, status, profiles:user_id(username, id)').eq('friend_id', session.user.id).in('status', ['accepted', 'pending']);
      const formattedSent = (sent || []).map(f => ({ ...f.profiles, id: f.friend_id, status: f.status }));
      const formattedReceived = (received || []).map(f => ({ ...f.profiles, id: f.user_id, status: f.status }));
      setFriends([...formattedSent, ...formattedReceived]);
    };
    fetchFriends();
  }, [session]);

  return (
    <div className="app-container">
      <div className="friend-screen">
        <div className="compare-home" onClick={() => navigate('/')} style={{ top: '50px', zIndex: 20 }}></div>
        <div className="friend-content">
          <h1>友達を選択</h1><p>診断する友達を選んでください</p>
          <div style={{ marginTop: '20px', width: '90%', margin: '20px auto', maxHeight: '500px', overflowY: 'auto' }}>
            {friends.map(friend => (<div key={friend.id} style={{ padding: '15px', background: 'white', marginBottom: '10px', borderRadius: '10px', color: '#333', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>{friend.username} さん</strong>{friend.status === 'accepted' ? (<div style={{ display: 'flex', gap: '5px' }}><button onClick={() => navigate('/diagnosis/friend', { state: { targetFriend: friend } })} className="friend-button" style={{ width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: 'transparent', border: '1px solid #8c7dc8', color: '#8c7dc8', fontSize: '12px' }}>診断する</button><button onClick={() => navigate('/history', { state: { targetFriend: friend } })} className="friend-button" style={{ width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: '#8c7dc8', color: 'white', fontSize: '12px' }}>結果を見る</button></div>) : (<span style={{fontSize: '12px', color: '#888'}}>承認待ち</span>)}</div>))}
            {friends.length === 0 && <p>友達がいません</p>}
          </div>
          <Link to="/friends" className="friend-button" style={{ backgroundColor: '#8c7dc8', width: '200px', margin: '20px auto', display: 'block', color: 'white', textDecoration: 'none', borderRadius: '20px', textAlign: 'center', padding: '10px 0', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>友達を追加する</Link>
        </div>
      </div>
    </div>
  );
};

export default FriendSelect;