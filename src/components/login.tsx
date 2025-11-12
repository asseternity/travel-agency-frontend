import { useState } from 'react';

type LoginProps = {
  setUserInfoCallback: Function;
  setLoggedInCallback: Function;
};

export default function Login({
  setUserInfoCallback,
  setLoggedInCallback,
}: LoginProps) {
  const [logInMode, setLogInMode] = useState<boolean>(true);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [firstName_s, setFirstName_s] = useState<string>('');
  const [lastName_s, setLastName_s] = useState<string>('');
  const [email_s, setEmail_s] = useState<string>('');
  const [password_s, setPassword_s] = useState<string>('');
  const [confirmPassword_s, setConfirmPassword_s] = useState<string>('');

  const handleLogin = () => {
    const newUser = {
      fullName: 'John Johnson',
      email: email,
    };
    if (password.length < 8) {
      return;
    }
    setUserInfoCallback(newUser);
    setLoggedInCallback(true);
  };

  const handleSignUp = () => {
    if (password_s.length < 8) {
      return;
    }
    if (password_s !== confirmPassword_s) {
      return;
    }
    const newUser = {
      fullName: firstName_s + ' ' + lastName_s,
      email: email_s,
    };
    setUserInfoCallback(newUser);
    setLoggedInCallback(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {logInMode ? (
        <div className="flex flex-col gap-5">
          <h1 className="text-xl">Please log in</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="user@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <label htmlFor="password">password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <button type="submit" className="bg-accent rounded w-full">
              Log In
            </button>
          </form>
          <button
            className="bg-accent rounded"
            onClick={() => setLogInMode(false)}
          >
            Don't have an account? Sign up instead
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <h1 className="text-xl">Please sign up</h1>
          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <label htmlFor="fname">First name:</label>
            <input
              type="text"
              id="fname"
              name="fname"
              placeholder="John"
              onChange={(e) => {
                setFirstName_s(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <label htmlFor="lname">Last name:</label>
            <input
              type="text"
              id="lname"
              name="lname"
              placeholder="Johnson"
              onChange={(e) => {
                setLastName_s(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="user@example.com"
              onChange={(e) => {
                setEmail_s(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <label htmlFor="password">password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword_s(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <label htmlFor="cpassword">confirm password:</label>
            <input
              type="password"
              id="cpassword"
              name="cpassword"
              onChange={(e) => {
                setConfirmPassword_s(e.target.value);
              }}
              className="border-2 rounded p-1"
              required
            />
            <button type="submit" className="bg-accent rounded w-full">
              Sign up
            </button>
          </form>
          <button
            className="bg-accent rounded"
            onClick={() => setLogInMode(true)}
          >
            Already registered? Login instead
          </button>
        </div>
      )}
    </div>
  );
}
