// src/components/ResultDisplay.tsx

import React, { useState, useEffect } from 'react';

interface ResultDisplayProps {
  shortUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ shortUrl }) => {
  const [copyText, setCopyText] = useState<string>('Copy');
  useEffect(() => {
    setCopyText('Copy');
  }, [shortUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopyText('Copied! 👍');
      setTimeout(() => {
        setCopyText('Copy');
      }, 2000); // Revert back to "Copy" after 2 seconds
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        setCopyText('Failed');
    });
  };

  return (
    <div className="result-container">
      <p>Here is your shortened link:</p>
      <div className="result-display">
        <a href={shortUrl} target="_blank" rel="noopener noreferrer">
          {shortUrl}
        </a>
        <button onClick={handleCopy} className={copyText === 'Copied! 👍' ? 'copied' : ''}>
          {copyText}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;