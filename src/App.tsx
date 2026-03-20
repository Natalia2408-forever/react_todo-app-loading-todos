import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorPutting } from './components/ErrorPutting/ErrorPutting';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [selected, setSelected] = useState<Filter>('all');

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage(ErrorMessage.LoadTodos);
        throw error;
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timingForError = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timingForError);
    }

    return;
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (selected === 'active') {
      return !todo.completed;
    }

    if (selected === 'completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} title={title} setTitle={setTitle} />
        {todos.length > 0 && <TodoList filteredTodos={filteredTodos} />}
        {todos.length !== 0 && (
          <Footer todos={todos} selected={selected} setSelected={setSelected} />
        )}
      </div>
      <ErrorPutting
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
