'use client';
import React, { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);

  async function submit() {
    const res = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    setResponse(await res.json());
  }

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={submit}>Go</button>
      <pre>{response && JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
