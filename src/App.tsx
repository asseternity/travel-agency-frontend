// dependencies
import { useState, useEffect } from 'react';
import './App.css';

// components
import type { userInfo } from './lib/userInfo';
import Landing from './components/landing';
import Login from './components/login';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);

  // Automatically log in the user if the token is present
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setLoading(false);
      return;
    }

    const autoLogin = async () => {
      try {
        const response = await fetch(
          'https://travel-agency-backend-production-ebdf.up.railway.app/auto-login',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('jwtToken', data.token);
          setUserInfo(data);
          setLoggedIn(true);
        }
      } catch (err) {
        console.error('Error during auto-login: ', err);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUserInfo(null);
    setLoggedIn(false);
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-10 px-4">
      {!loading && (
        <>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
            Welcome to Travel Agency
          </h1>
          {!loggedIn && (
            <Login
              setUserInfoCallback={setUserInfo}
              setLoggedInCallback={setLoggedIn}
            />
          )}
          {loggedIn && userInfo && (
            <div>
              <Landing
                full_name={userInfo.full_name}
                email={userInfo.email}
                setLoadingCallback={setLoading}
              />
              <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
              >
                Log out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
