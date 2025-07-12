import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import { VisitorItem } from './VisitorItem';
import styles from './VisitorList.module.css';

interface VisitorListProps {
  visitors: Visitor[];
  onOpenModal: (visitor: Visitor) => void;
}

export const VisitorList: FC<VisitorListProps> = ({ visitors, onOpenModal }) => {
  return (
    <table className={styles.visitorTable}>
      <thead>
        <tr className="visitor-table title">
          <th>№</th>
          <th>ФИО</th>
          <th>Компания</th>
          <th>Группа</th>
          <th>Присутствие</th>
        </tr>
      </thead>
      <tbody>
        {visitors.length === 0 ? (
          <tr>
            <td colSpan={5}>Нет посетителей</td>
          </tr>
        ) : (
          visitors.map((visitor, index) => (
            <VisitorItem
              key={visitor.id}
              visitor={visitor}
              index={index + 1}
              onOpenModal={onOpenModal}
            />
          ))
        )}
      </tbody>
    </table>
  );
};