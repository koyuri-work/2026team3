import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Friend.css';

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
    if (error || !profile) { setMessage('ユーザーが見つかりませんでした。'); return; }
    const { data: friendship } = await supabase.from('friendships').select('status').or(`and(user_id.eq.${session.user.id},friend_id.eq.${profile.id}),and(user_id.eq.${profile.id},friend_id.eq.${session.user.id})`).maybeSingle();
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
    <div className="app-container">
      <div className="friend-screen">
        <div className="compare-home" onClick={() => navigate('/')} style={{ top: '50px', zIndex: 20 }}></div>
        <div className="friend-content">
          <h1>フレンド追加</h1><p>相手の検索IDを入力してください</p>
          <div className="search-box"><input type="text" placeholder="検索用ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} /><div className="search-icon" onClick={searchUser}></div></div>
          {message && <p>{message}</p>}
          {searchResult && (<div style={{ marginTop: '20px', padding: '15px', background: '#eee', borderRadius: '10px', color: '#333', width: '280px', margin: '20px auto' }}><p style={{ fontSize: '1.1em', color: '#000' }}><strong>{searchResult.username}</strong> さん</p>{searchResult.id === session.user.id ? (<p style={{ fontSize: '12px', color: '#666' }}>自分自身です</p>) : searchResult.friendshipStatus === 'accepted' ? (<p style={{ fontSize: '12px', color: '#666' }}>既につながっています</p>) : searchResult.friendshipStatus === 'pending' ? (<p style={{ fontSize: '12px', color: '#666' }}>申請中または承認待ちです</p>) : (<button onClick={() => addFriend(searchResult.id)} className="friend-button" style={{ backgroundColor: '#8c7dc8', width: '100%', margin: '10px 0' }}>申請する</button>)}</div>)}
          <div style={{ marginTop: '30px', width: '90%', margin: '30px auto' }}>{requests.length > 0 && <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>届いているリクエスト</h3>}{requests.map((req) => (<div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'white', marginBottom: '10px', borderRadius: '8px', color: '#333' }}><span><strong>{req.profiles.username}</strong></span><button onClick={() => acceptFriend(req.id)} className="friend-button" style={{ width: 'auto', padding: '8px 15px', margin: 0, backgroundColor: '#28a745', fontSize: '12px' }}>承認</button></div>))}</div>
        </div>
      </div>
    </div>
  );
};

export default FriendSystem;