// src/App.tsx

import { useState } from 'react';
import './App.css';
import ShortenerForm from './components/ShortenerForm';
import ResultDisplay from './components/ResultDisplay';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 

function App() {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleShortenUrl = async (longUrl: string) => {
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/url/shortern`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong on the server.');
      }
      setShortUrl(data.shortUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
      </header>
      <main>
        <ShortenerForm onShorten={handleShortenUrl} loading={loading} />
        {error && <p className="error-message">{error}</p>}
        {shortUrl && <ResultDisplay shortUrl={shortUrl} />}
      </main>
    </div>
  );
}

export default App;