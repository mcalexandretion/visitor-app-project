import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import { VisitorItem } from './VisitorItem';
import styles from './VisitorList.module.css';

interface VisitorListProps {
  visitors: Visitor[];
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
}

export const VisitorList: FC<VisitorListProps> = ({ visitors, onEdit, onDelete }) => {
  return (
    <table className={styles.visitorTable}>
      <thead>
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Компания</th>
          <th>Группа</th>
          <th>Присутствие</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {visitors.length === 0 ? (
          <tr>
            <td colSpan={6}>Нет посетителей</td>
          </tr>
        ) : (
          visitors.map((visitor, index) => (
            <VisitorItem
              key={visitor.id}
              visitor={visitor}
              index={index + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};