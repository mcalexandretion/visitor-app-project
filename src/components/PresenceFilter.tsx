import type { FC } from 'react';
import {useState, useEffect} from 'react';
import './PresenceFilter.module.css';

interface PresenceFilterProps {
  onFilter: (present: boolean | undefined) => void;
  initialPresent: boolean | undefined;
}

export const PresenceFilter: FC<PresenceFilterProps> = ({ onFilter, initialPresent }) => {
  const [present, setPresent] = useState<boolean | undefined>(initialPresent);

  useEffect(() => {
    setPresent(initialPresent);
  }, [initialPresent]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : e.target.value === 'true';
    setPresent(value);
    onFilter(value);
  };

  return (
    <div className="presence-filter">
      <label>Присутствие</label>
      <select value={present === undefined ? '' : present.toString()} onChange={handleChange}>
        <option value="">Все</option>
        <option value="true">Присутствуют</option>
        <option value="false">Отсутствуют</option>
      </select>
    </div>
  );
};