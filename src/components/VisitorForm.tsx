import type { FC, FormEvent} from 'react';
import { useState } from 'react';
import type { Visitor } from '../types/visitor';
import './VisitorForm.module.css';

interface VisitorFormProps {
  visitor?: Visitor;
  onSubmit: (data: Omit<Visitor, 'id'>) => void;
  onClose: () => void;
}

export const VisitorForm: FC<VisitorFormProps> = ({ visitor, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Omit<Visitor, 'id'>>({
    fullName: visitor?.fullName || '',
    company: visitor?.company || '',
    group: visitor?.group || 'Прохожий',
    present: visitor?.present || false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="visitor-form">
      <div className="form-group">
        <label>ФИО</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Компания</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Группа</label>
        <select
          value={formData.group}
          onChange={(e) => setFormData({ ...formData, group: e.target.value as Visitor['group'] })}
        >
          <option value="Прохожий">Прохожий</option>
          <option value="Клиент">Клиент</option>
          <option value="Партнер">Партнер</option>
          <option value="Гости">Гости</option>
        </select>
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.present}
            onChange={(e) => setFormData({ ...formData, present: e.target.checked })}
          />
          Присутствует
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </div>
    </form>
  );
};