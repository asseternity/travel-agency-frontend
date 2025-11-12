// dependencies
import { useState } from 'react';
import './App.css';

// components
import type { userInfo } from './lib/userInfo';
import Landing from './components/landing';
import Login from './components/login';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);

  const handleLogout = () => {
    setUserInfo(null);
    setLoggedIn(false);
  };

  return (
    <>
      <h1 className="text-2xl">Welcome to Travel Agency</h1>
      {!loggedIn && (
        <Login
          setUserInfoCallback={setUserInfo}
          setLoggedInCallback={setLoggedIn}
        />
      )}
      {loggedIn && userInfo && (
        <div>
          <Landing fullName={userInfo.fullName} email={userInfo.email} />
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </>
  );
}

export default App;
