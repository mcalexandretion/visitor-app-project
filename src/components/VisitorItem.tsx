import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import './VisitorItem.module.css';

interface VisitorItemProps {
  visitor: Visitor;
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
}

export const VisitorItem: FC<VisitorItemProps> = ({ visitor, onEdit, onDelete }) => {
  return (
    <div className="visitor-item">
      <div>
        <h3>{visitor.fullName}</h3>
        <p>Компания: {visitor.company}</p>
        <p>Группа: {visitor.group}</p>
        <p>Присутствует: {visitor.present ? 'Да' : 'Нет'}</p>
      </div>
      <div className="visitor-actions">
        <button onClick={() => onEdit(visitor)}>Редактировать</button>
        <button onClick={() => onDelete(visitor.id)}>Удалить</button>
      </div>
    </div>
  );
};