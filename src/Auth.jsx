import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { IMAGES } from '../constants';
import './Auth.css';

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
    <div className="auth-wrapper">
      <div className="auth-screen">
        <div className="auth-top-wave"></div>
        <div className="auth-circle"></div>
        <div className="auth-title">{isSignUp ? 'SIGN UP' : 'LOG IN'}</div>
        <img src={IMAGES.home2Img} className="auth-puzzle-small" alt="" />
        <img src={IMAGES.homeImg} className="auth-puzzle-big" alt="" />
        <form onSubmit={handleAuth} className="auth-form-container">
          {isSignUp && (
            <>
              <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" required />
              <input type="text" placeholder="検索用ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="auth-input" required />
            </>
          )}
          <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" required />
          <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" required />
          {message && <p className="auth-error-msg">{message}</p>}
          <button type="submit" className="auth-submit-button" disabled={loading}>{loading ? '処理中...' : (isSignUp ? '登録する' : 'サインイン')}</button>
          <div className="auth-divider">
            <div className="auth-line"></div>
            <span className="auth-or-text">or</span>
            <div className="auth-line"></div>
          </div>
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }} className="auth-toggle-button">
            {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;