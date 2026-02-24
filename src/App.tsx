import { useState } from 'react';
import { DiagnosisPage } from './DiagnosisPage';
import { LoginPage } from './LoginPage';

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <>
      {!userId ? (
        <LoginPage onLogin={(id) => setUserId(id)} />
      ) : (
        <DiagnosisPage />
      )}
    </>
  );
}

export default App;