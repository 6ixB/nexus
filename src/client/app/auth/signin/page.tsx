'use client';

import { useState } from 'react';

export default function SignIn() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1 className="text-3xl font-black text-blue-100">Signin</h1>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </main>
  );
}
