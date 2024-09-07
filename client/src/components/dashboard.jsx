import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ShortenUrlForm from './ShortenUrlForm';
import { auth, googleAuthProvider } from './firebase'; // Import Firebase auth
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const [label, setLabel] = useState(''); // State for URL label
  const [user, setUser] = useState(null); // State for authenticated user
  const history = useHistory();

  useEffect(() => {
    // Fetch todos from the backend
    fetch('/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Error fetching todos:', err));

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleAddTodo = (title) => {
    fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false })
    })
      .then(res => res.json())
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(err => console.error('Error adding todo:', err));
  };

  const handleDeleteTodo = (id) => {
    fetch(`/todos/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.error('Error deleting todo:', err));
  };

  const handleUpdateTodo = (id, updatedData) => {
    fetch(`/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(updatedTodo => setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo))))
      .catch(err => console.error('Error updating todo:', err));
  };

  const handleShortenUrl = async (url) => {
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url })
    });
    const data = await res.json();
    return data.shortUrl; // Return shortened URL
  };

  const handleSaveUrl = (shortenedUrl, qrCodeImageSrc) => {
    if (!label) {
      alert('Please enter a label');
      return;
    }

    const newEntry = { label, shortenedUrl, qrCodeImageSrc };
    setUrlList([...urlList, newEntry]);
    setLabel(''); // Clear the label input
  };

  const handleDeleteUrl = (index) => {
    const updatedList = urlList.filter((_, i) => i !== index);
    setUrlList(updatedList);
  };

  const handleLogin = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        {user ? (
          <button onClick={handleLogout} className="btn">Logout</button>
        ) : (
          <button onClick={handleLogin} className="btn">Login with Google</button>
        )}
      </header>
      
      <section className="todos-section">
        <h2>Todo List</h2>
        <TodoForm onAdd={handleAddTodo} />
        <TodoList todos={todos} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
      </section>

      <section className="url-shortener">
        <h2>Shorten a URL and Generate QR Code</h2>
        <ShortenUrlForm onShortenUrl={handleShortenUrl} onSaveUrl={handleSaveUrl} />
      </section>

      <section className="url-list">
        <h2>Saved Shortened URLs and QR Codes</h2>
        <ul>
          {urlList.map((item, index) => (
            <li key={index} className="url-item">
              <p>Label: {item.label}</p>
              <p>Shortened URL: <a href={item.shortenedUrl} target="_blank" rel="noopener noreferrer">{item.shortenedUrl}</a></p>
              {item.qrCodeImageSrc && <img src={item.qrCodeImageSrc} alt="QR Code" />}
              <button onClick={() => handleDeleteUrl(index)} className="btn delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
