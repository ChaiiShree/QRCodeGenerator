import React from 'react';
import Todo from './Todo';

const TodoList = ({ todos, onDelete, onUpdate, onShortenUrl }) => {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <Todo
          key={todo._id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onShortenUrl={onShortenUrl} // Pass down URL shortener handler
        />
      ))}
    </div>
  );
};

export default TodoList;
