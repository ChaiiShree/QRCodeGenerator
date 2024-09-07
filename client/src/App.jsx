import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Include styles
import { auth, signInWithPopup, provider, signOut } from './firebase'; // Import from Firebase v9+
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [qrCodeImageSrc, setQRCodeImageSrc] = useState(null);
  const [urlList, setUrlList] = useState([]);
  const [label, setLabel] = useState(''); // State for label
  const [user, setUser] = useState(null); // State for authenticated user
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleShortenUrl = async () => {
    try {
      const response = await axios.post('http://localhost:5050/shorten', { originalUrl });
      setShortenedUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

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

  const handleSave = () => {
    if (!label) {
      alert('Please enter a label');
      return;
    }

    const newEntry = { label, shortenedUrl, qrCodeImageSrc };
    setUrlList([...urlList, newEntry]);
    setLabel(''); // Clear the label input
  };

  const handleDelete = (index) => {
    const updatedList = urlList.filter((_, i) => i !== index);
    setUrlList(updatedList);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>QR & URL Shortener Dashboard</h1>
        <h2>Shorten URLs and Generate QR Codes Effortlessly</h2>
        {user ? (
          <button onClick={handleLogout} className="btn">Logout</button>
        ) : (
          <button onClick={handleLogin} className="btn">Login with Google</button>
        )}
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
            <div className="input-group">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter label for URL"
                className="url-input"
              />
              <button onClick={handleSave} className="btn save-btn">Save URL & QR Code</button>
            </div>
          </div>
        )}
      </section>

      <section className="url-list">
        <h3>Saved Shortened URLs and QR Codes</h3>
        <ul>
          {urlList.map((item, index) => (
            <li key={index} className="url-item">
              <p>Label: {item.label}</p>
              <p>Shortened URL: <a href={item.shortenedUrl} target="_blank" rel="noopener noreferrer">{item.shortenedUrl}</a></p>
              {item.qrCodeImageSrc && <img src={item.qrCodeImageSrc} alt="QR Code" />}
              <button onClick={() => handleDelete(index)} className="btn delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
