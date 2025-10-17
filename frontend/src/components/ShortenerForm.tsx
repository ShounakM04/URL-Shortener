// src/components/ShortenerForm.tsx

import React, { useState } from 'react';

interface ShortenerFormProps {
  onShorten: (url: string) => void;
  loading: boolean;
}

const ShortenerForm: React.FC<ShortenerFormProps> = ({ onShorten, loading }) => {
  const [url, setUrl] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

  // Basic URL validation
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setInputError('Please enter a URL.');
      return;
    }
    // Ensure the URL has a protocol
    if (!/^(https?|ftp):\/\//i.test(url)) {
      setInputError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    if (!isValidUrl(url)) {
      setInputError('The URL entered is not valid.');
      return;
    }
    setInputError('');
    onShorten(url);
  };

  return (
    <form onSubmit={handleSubmit} className="shortener-form">
      <div className="input-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a long URL to shorten..."
          className={inputError ? 'input-error' : ''}
          disabled={loading}
          aria-label="URL to shorten"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten!'}
        </button>
      </div>
      {inputError && <p className="input-error-text">{inputError}</p>}
    </form>
  );
};

export default ShortenerForm;