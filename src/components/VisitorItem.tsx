import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import styles from './VisitorItem.module.css';

interface VisitorItemProps {
  visitor: Visitor;
  index: number; // Индекс для номера
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
}

export const VisitorItem: FC<VisitorItemProps> = ({ visitor, index, onEdit, onDelete }) => {
  const handleRowClick = () => {
    onEdit(visitor); // Передаем посетителя для редактирования
  };

  return (
    <tr className={styles.visitorRow} onClick={handleRowClick}>
      <td>{index}</td>
      <td>{visitor.fullName}</td>
      <td>{visitor.company}</td>
      <td>{visitor.group}</td>
      <td>
        {visitor.present ? (
          <span className={styles.presentCircle}></span>
        ) : (
          <span className={styles.absentCircle}></span>
        )}
      </td>
      <td>
        <button onClick={(e) => { e.stopPropagation(); onDelete(visitor.id); }}>Удалить</button>
      </td>
    </tr>
  );
};