import { useState, useEffect } from 'react';

type LoginProps = {
  setUserInfoCallback: Function;
  setLoggedInCallback: Function;
};

const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

export default function Login({
  setUserInfoCallback,
  setLoggedInCallback,
}: LoginProps) {
  const [logInMode, setLogInMode] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [signUpTouched, setSignUpTouched] = useState(false);
  const [firstName_s, setFirstName_s] = useState<string>('');
  const [lastName_s, setLastName_s] = useState<string>('');
  const [email_s, setEmail_s] = useState<string>('');
  const [password_s, setPassword_s] = useState<string>('');
  const [confirmPassword_s, setConfirmPassword_s] = useState<string>('');

  function validateSignUpFields() {
    if (firstName_s.length < 2)
      return 'First name must be at least 2 characters';
    if (lastName_s.length < 2) return 'Last name must be at least 2 characters';
    if (!email_s.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return 'Invalid email format';
    if (!passwordRegex.test(password_s))
      return 'Password must be 8+ chars with at least 1 number and 1 symbol';
    if (password_s !== confirmPassword_s) return 'Passwords do not match';
    return null;
  }

  useEffect(() => {
    if (!logInMode && signUpTouched) {
      const validationMessage = validateSignUpFields();
      setError(validationMessage || '');
    }
  }, [
    firstName_s,
    lastName_s,
    email_s,
    password_s,
    confirmPassword_s,
    logInMode,
  ]);

  function emptyFields() {
    setSignUpTouched(false);
    setError('');
    setEmail('');
    setPassword('');
    setFirstName_s('');
    setLastName_s('');
    setEmail_s('');
    setPassword_s('');
    setConfirmPassword_s('');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        'https://travel-agency-backend-production-ebdf.up.railway.app/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwtToken', data.token);
        setUserInfoCallback(data);
        setLoggedInCallback(true);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    try {
      const res = await fetch(
        'https://travel-agency-backend-production-ebdf.up.railway.app/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email_s,
            password: password_s,
            confirmPassword: confirmPassword_s,
            firstName: firstName_s,
            lastName: lastName_s,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwtToken', data.token);
        setUserInfoCallback(data);
        setLoggedInCallback(true);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-red-600 font-medium text-center">{error}</div>
      {logInMode ? (
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Please log in
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              value={email}
              type="email"
              id="email"
              name="email"
              placeholder="user@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </label>
            <input
              value={password}
              type="password"
              id="password"
              name="password"
              placeholder="********"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-lg transition"
            >
              Login
            </button>
          </form>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
            onClick={() => {
              emptyFields();
              setLogInMode(false);
            }}
          >
            Don't have an account? Sign up instead
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Please sign up
          </h1>
          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <label htmlFor="fname_s" className="text-gray-700 font-medium">
              First name
            </label>
            <input
              value={firstName_s}
              type="text"
              id="fname_s"
              name="fname_s"
              placeholder="John"
              onChange={(e) => {
                setFirstName_s(e.target.value);
                setSignUpTouched(true);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <label htmlFor="lname_s" className="text-gray-700 font-medium">
              Last name
            </label>
            <input
              value={lastName_s}
              type="text"
              id="lname_s"
              name="lname_s"
              placeholder="Johnson"
              onChange={(e) => {
                setLastName_s(e.target.value);
                setSignUpTouched(true);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <label htmlFor="email_s" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              value={email_s}
              type="email"
              id="email_s"
              name="email_s"
              placeholder="user@example.com"
              onChange={(e) => {
                setEmail_s(e.target.value);
                setSignUpTouched(true);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <label htmlFor="password_s" className="text-gray-700 font-medium">
              Password
            </label>
            <input
              value={password_s}
              type="password"
              id="password_s"
              name="password_s"
              onChange={(e) => {
                setPassword_s(e.target.value);
                setSignUpTouched(true);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <label htmlFor="cpassword_s" className="text-gray-700 font-medium">
              Confirm password
            </label>
            <input
              value={confirmPassword_s}
              type="password"
              id="cpassword_s"
              name="cpassword_s"
              onChange={(e) => {
                setConfirmPassword_s(e.target.value);
                setSignUpTouched(true);
              }}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-lg transition"
            >
              Sign up
            </button>
          </form>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
            onClick={() => {
              emptyFields();
              setLogInMode(true);
            }}
          >
            Already registered? Login instead
          </button>
        </div>
      )}
    </div>
  );
}
