import type { FC } from 'react';
import type { Visitor } from '../types/visitor';
import styles from './VisitorItem.module.css';

interface VisitorItemProps {
  visitor: Visitor;
  index: number;
  onOpenModal: (visitor: Visitor) => void;
}

export const VisitorItem: FC<VisitorItemProps> = ({ visitor, index, onOpenModal }) => {
  const handleRowClick = () => {
    onOpenModal(visitor); 
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
    </tr>
  );
};