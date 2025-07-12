import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import styles from './Modal.module.css';
import closeCircle from '../assets/close-circle.png'
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    console.log('Modal mounted, isOpen:', isOpen); 
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isOpen]); 

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
  className={styles.closeButton}
  onClick={onClose}
  aria-label="Закрыть"
  type="button"
>
  <img src={closeCircle} alt="Закрыть" className={styles.closeIcon} />
</button>

        {children}
      </div>
    </div>
  );
};