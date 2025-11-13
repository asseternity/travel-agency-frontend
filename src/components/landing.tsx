import { useState, useEffect } from 'react';
import type { userInfo } from '../lib/userInfo';

type LandingProps = {
  full_name: string;
  email: string;
  setLoadingCallback: Function;
};

export default function Landing({
  full_name,
  email,
  setLoadingCallback,
}: LandingProps) {
  const [allUsers, setAllUsers] = useState<userInfo[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(
          'https://travel-agency-backend-production-ebdf.up.railway.app/users',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setAllUsers(data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCallback(false);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Landing page</h1>
        <p className="text-gray-700 text-lg">User: {full_name}</p>
        <p className="text-gray-700 text-lg">Email: {email}</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          All users:
        </h2>
        <ul className="space-y-2">
          {allUsers.map((user) => {
            return (
              <li
                className="bg-gray-100 p-3 rounded-lg shadow-sm text-gray-700"
                key={`user_${user.email}`}
              >
                {user.full_name} | {user.email}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
