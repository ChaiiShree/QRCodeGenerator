import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Include styles

const App = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [qrCodeImageSrc, setQRCodeImageSrc] = useState(null);
  const [urlList, setUrlList] = useState([]);

  // Handle URL Shortening
  const handleShortenUrl = async () => {
    try {
      const response = await axios.post('http://localhost:5050/shorten', { originalUrl });
      setShortenedUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  // Handle QR Code Generation
  const handleGenerateQRCode = async () => {
    try {
      const response = await axios.post('http://localhost:5050/todos/generate-qr', { url: shortenedUrl });
      const base64Image = `data:image/png;base64,${btoa(
        new Uint8Array(response.data.qrCodeImage.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setQRCodeImageSrc(base64Image);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Save the shortened URL and QR code
  const handleSave = () => {
    const newEntry = { shortenedUrl, qrCodeImageSrc };
    setUrlList([...urlList, newEntry]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>QR & URL Shortener Dashboard</h1>
        <h2>Shorten URLs and Generate QR Codes Effortlessly</h2>
      </header>

      <section className="url-shortener">
        <h3>Generate a Shortened URL and QR Code</h3>
        <div className="input-group">
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            className="url-input"
          />
          <button onClick={handleShortenUrl} className="btn">Shorten URL</button>
        </div>
        
        {shortenedUrl && (
          <div className="result">
            <p>Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a></p>
            <button onClick={handleGenerateQRCode} className="btn">Generate QR Code</button>
            {qrCodeImageSrc && (
              <div className="qr-result">
                <img src={qrCodeImageSrc} alt="QR Code" />
              </div>
            )}
            <button onClick={handleSave} className="btn save-btn">Save URL & QR Code</button>
          </div>
        )}
      </section>

      <section className="url-list">
        <h3>Saved Shortened URLs and QR Codes</h3>
        <ul>
          {urlList.map((item, index) => (
            <li key={index}>
              <p>Shortened URL: <a href={item.shortenedUrl} target="_blank" rel="noopener noreferrer">{item.shortenedUrl}</a></p>
              {item.qrCodeImageSrc && <img src={item.qrCodeImageSrc} alt="QR Code" />}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
