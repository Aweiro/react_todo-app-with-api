/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodos: (id: number) => void;
  onUpdatePost: (todo: Todo) => void;
  loading: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdatePost,
  onDeleteTodos,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const [showInput, setShowInput] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setShowInput(true);
    setQuery(todo.title);
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === todo.title) {
      setShowInput(false);

      return;
    }

    if (trimmedQuery === '') {
      onDeleteTodos(todo.id);
      setShowInput(false);

      return;
    }

    onUpdatePost({ ...todo, title: query.trim() });
    setShowInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowInput(false);
    }

    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onUpdatePost({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {showInput ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onBlur={handleSubmit}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
          <button
            type="button"
            data-cy="ForceEdit"
            onClick={handleDoubleClick}
            style={{ display: 'none' }}
          />
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!showInput && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodos(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading.includes(todo.id || 0),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

/* <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             {/* This form is shown instead of the title and remove button */
//             <form>
//               <input
//                 data-cy="TodoTitleField"
//                 type="text"
//                 className="todo__title-field"
//                 placeholder="Empty todo will be deleted"
//                 value="Todo is being edited now"
//               />
//             </form>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div> */
