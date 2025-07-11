import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import { VisitorItem } from './VisitorItem';
import './VisitorList.module.css';

interface VisitorListProps {
  visitors: Visitor[];
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
}

export const VisitorList: FC<VisitorListProps> = ({ visitors, onEdit, onDelete }) => {
  return (
    <div className="visitor-list">
      {visitors.length === 0 ? (
        <p>Нет посетителей</p>
      ) : (
        visitors.map((visitor) => (
          <VisitorItem
            key={visitor.id}
            visitor={visitor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};