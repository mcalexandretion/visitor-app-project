import type { FC, FormEvent } from 'react';
import {useState, useEffect} from 'react';
import './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (fullName: string) => void;
  initialSearch: string;
}

export const SearchForm: FC<SearchFormProps> = ({ onSearch, initialSearch }) => {
  const [fullName, setFullName] = useState(initialSearch);

  useEffect(() => {
    setFullName(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Введите имя"
      />
      <button type="submit">Поиск</button>
    </form>
  );
};