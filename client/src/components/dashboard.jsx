import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ShortenUrlForm from './ShortenUrlForm';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);

  // Fetch todos from the backend
  useEffect(() => {
    fetch('/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Error fetching todos:', err));
  }, []);

  const handleAddTodo = (title) => {
    // Send new todo to backend
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
    // Delete todo from backend
    fetch(`/todos/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.error('Error deleting todo:', err));
  };

  const handleUpdateTodo = (id, updatedData) => {
    // Update todo in backend
    fetch(`/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
      })
      .catch(err => console.error('Error updating todo:', err));
  };

  const handleShortenUrl = async (url) => {
    // Send URL to the backend to shorten
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url })
    });
    const data = await res.json();
    return data.shortUrl; // Return shortened URL
  };

  return (
    <div className="dashboard">
      <h1>Todo Dashboard</h1>
      <TodoForm onAdd={handleAddTodo} />
      <TodoList todos={todos} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} onShortenUrl={handleShortenUrl} />
      
      <h2>Shorten a URL</h2>
      <ShortenUrlForm onShortenUrl={handleShortenUrl} />
    </div>
  );
};

export default Dashboard;
