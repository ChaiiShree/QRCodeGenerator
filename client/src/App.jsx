import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, signInWithPopup, GoogleAuthProvider, signOut } from './firebase'; // Firebase auth
import './App.css'; // Styling
import Footer from './components/Footer'; // Footer component
import { ThemeProvider, useTheme } from './ThemeContext'; // Theme context for dark mode

const AppContent = () => {
  const [originalUrl, setOriginalUrl] = useState(''); // URL to be shortened
  const [label, setLabel] = useState(''); // Optional label for the URL
  const [shortenedUrl, setShortenedUrl] = useState(''); // Shortened URL from backend
  const [qrCodeImageSrc, setQRCodeImageSrc] = useState(null); // QR code image source
  const [urlList, setUrlList] = useState([]); // List of shortened URLs
  const [user, setUser] = useState(null); // Firebase authenticated user
  const { darkMode, toggleTheme } = useTheme(); // Dark mode from context

  const provider = new GoogleAuthProvider(); // Firebase Google Auth provider

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle login with Google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle URL shortening (login not required)
  const handleShortenUrl = async () => {
    if (!originalUrl) {
      alert('Please enter a URL to shorten');
      return;
    }

    try {
      const requestBody = {
        originalUrl,
        label,
      };

      // If the user is logged in, include their userId
      if (user) {
        requestBody.userId = user.uid;
      }

      const response = await axios.post('https://qrurlapi.vercel.app/shorten', requestBody);
      setShortenedUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error shortening URL:', error.response?.data || error);
    }
  };

  // Handle QR code generation (no login required)
  const handleGenerateQRCode = async () => {
    if (!shortenedUrl) return;

    try {
      const response = await axios.post('https://qrurlapi.vercel.app/todos/generate-qr', { url: shortenedUrl });
      const base64Image = `data:image/png;base64,${btoa(
        new Uint8Array(response.data.qrCodeImage.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setQRCodeImageSrc(base64Image); // Set the QR code image
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Handle saving the URL and QR code to the list
  const handleSave = () => {
    if (!label) {
      alert('Please enter a label for the URL');
      return;
    }

    const newEntry = { label, shortenedUrl, qrCodeImageSrc };
    setUrlList([...urlList, newEntry]); // Add to list
    setLabel(''); // Clear the label input
  };

  // Handle URL deletion from the list
  const handleDelete = (index) => {
    const updatedList = urlList.filter((_, i) => i !== index); // Remove item at index
    setUrlList(updatedList);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header>
        <h1>QR & URL Shortener</h1>
        <h2>Shorten URLs and Generate QR Codes Effortlessly</h2>
        
        <button onClick={toggleTheme} className="btn theme-toggle">
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>

        {user ? (
          <div className='Logbtn'>
            <button onClick={handleLogout} className="btn">Logout</button>
            <p>Welcome, {user.displayName}</p>
          </div>
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
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter label for URL"
            className="url-input"
          />
          <button onClick={handleShortenUrl} className="btn">Shorten URL</button>
        </div>

        {shortenedUrl && (
          <div className="result">
            <p>
              Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </p>
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
            <li key={index} className="url-item">
              <p>Label: {item.label}</p>
              <p>Shortened URL: <a href={item.shortenedUrl} target="_blank" rel="noopener noreferrer">{item.shortenedUrl}</a></p>
              {item.qrCodeImageSrc && <img src={item.qrCodeImageSrc} alt="QR Code" />}
              <button onClick={() => handleDelete(index)} className="btn delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
