import React, { useState } from 'react';

const ShortenUrlForm = ({ onShortenUrl }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    const shortenedUrl = await onShortenUrl(url); // Shorten the URL
    setShortUrl(shortenedUrl);
    setUrl('');
  };

  return (
    <div className="shorten-url-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
      )}
    </div>
  );
};

export default ShortenUrlForm;
