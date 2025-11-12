import type { userInfo } from '../lib/userInfo';

export default function Landing({ fullName, email }: userInfo) {
  return (
    <div>
      <h1>Landing page</h1>
      <p>User: {fullName}</p>
      <p>Email: {email}</p>
    </div>
  );
}
