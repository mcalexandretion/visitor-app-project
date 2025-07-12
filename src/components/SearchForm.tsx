import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (fullName: string) => void;
  initialSearch: string;
}

export const SearchForm: FC<SearchFormProps> = ({ onSearch, initialSearch }) => {
  const [fullName, setFullName] = useState(initialSearch);

  useEffect(() => {
    setFullName(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(fullName);}, 300);

    return () => clearTimeout(timer);
  }, [fullName, onSearch]);

  return (
    <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Поиск по имени"
        className={styles.searchInput}
      />
    </form>
  );
};
 