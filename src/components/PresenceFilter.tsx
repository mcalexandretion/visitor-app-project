import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styles from './PresenceFilter.module.css';

interface PresenceFilterProps {
  onFilter: (present: boolean | undefined) => void;
  initialPresent: boolean | undefined;
}

export const PresenceFilter: FC<PresenceFilterProps> = ({ onFilter, initialPresent }) => {
  const [present, setPresent] = useState<boolean | undefined>(initialPresent);

  useEffect(() => {
    setPresent(initialPresent);
  }, [initialPresent]);

  const handleClick = (value: boolean | undefined) => {
    setPresent(value);
    onFilter(value);
  };

  return (
    <div className={styles.presenceFilter}>
      <label className={styles.filterLabel}>Фильтровать по:</label>
      <button
        className={`${styles.filterButton} ${present === false ? styles.active : ''}`}
        onClick={() => handleClick(false)}
      >
        Отсутствующим
      </button>
      <button
        className={`${styles.filterButton} ${present === true ? styles.active : ''}`}
        onClick={() => handleClick(true)}
      >
        Присутствующим
      </button>
      <button
        className={`${styles.filterButton} ${present === undefined ? styles.active : ''}`}
        onClick={() => handleClick(undefined)}
      >
        Без фильтра
      </button>
    </div>
  );
};