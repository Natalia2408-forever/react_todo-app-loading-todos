/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { ErrorPutting } from './ErrorPutting';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('All');

  useEffect(() => {
    const fetchingTodos = async () => {
      try {
        const todo = await getTodos();
        setTodos(todo);
      } catch {
        setError('Unable to load todos');
      }
    };

    fetchingTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timingForError = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timingForError);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];
    switch (selected) {
      case 'All':
        return filtered;

      case 'Active':
        return (filtered = filtered.filter(todo => !todo.completed));

      case 'Completed':
        return (filtered = filtered.filter(todo => todo.completed));

      default:
        return filtered;
    }
  }, [selected, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />
        <TodoList filteredTodos={filteredTodos} />
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedTodo={selected}
            forSaveSelectedTodo={setSelected}
          />
        )}
      </div>
      <ErrorPutting errormessage={error} onClose={() => setError('')} />
    </div>
  );
};
