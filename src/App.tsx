import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Travel Agency</h1>
      <div className="card">
        <button
          className="p-5 bg-accent rounded shadow-2xl hover:bg-amber-800"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
