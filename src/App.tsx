import { useState } from 'react';
import { useVisitors } from './hooks/useVisitors';
import { createVisitor, updateVisitor, deleteVisitor } from './services/api';
import { VisitorList } from './components/VisitorList';
import { VisitorForm } from './components/VisitorForm';
import { Modal } from './components/Modal';
import { SearchForm } from './components/SearchForm';
import { PresenceFilter } from './components/PresenceFilter';
import type { Visitor } from './types/visitor';
import logo from './assets/logo.png';
import './index.css';

function App() {
  const {
    visitors,
    allVisitors,
    filters,
    setFilters,
    setAllVisitors,
    setVisitors,
    isLoading,
    loadVisitors,
  } = useVisitors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const getVisitorCounts = () => ({
    presentCount: allVisitors.filter((v) => v.present).length,
    absentCount: allVisitors.filter((v) => !v.present).length,
  });

  const handleSearch = (fullName: string) => {
    setFilters({ ...filters, fullName: fullName || undefined });
  };

  const handlePresenceFilter = (present: boolean | undefined) => {
    setFilters({ ...filters, present });
  };

  const handleAdd = async (data: Omit<Visitor, 'id'>) => {
    try {
      const newVisitor = await createVisitor(data);
      const updatedAll = [...allVisitors, newVisitor];
      setAllVisitors(updatedAll);
      loadVisitors(filters);
      setIsModalOpen(false);
    } catch (e) {
      console.error('Ошибка создания посетителя', e);
    }
  };

  const handleEdit = async (data: Omit<Visitor, 'id'>) => {
    if (!selectedVisitor) return;
    try {
      const updated = await updateVisitor(selectedVisitor.id, data);
      const updatedAll = allVisitors.map((v) =>
        v.id === updated.id ? updated : v
      );
      setAllVisitors(updatedAll);
      loadVisitors(filters);
      setSelectedVisitor(null);
      setIsModalOpen(false);
    } catch (e) {
      console.error('Ошибка изменения данных посетителя', e);
    }
  };

  const handleDelete = async () => {
    if (!selectedVisitor) return;
    if (window.confirm('Удалить посетителя?')) {
      try {
        await deleteVisitor(selectedVisitor.id);
        const updated = allVisitors.filter((v) => v.id !== selectedVisitor.id);
        setAllVisitors(updated);
        loadVisitors(filters);
        setSelectedVisitor(null);
        setIsModalOpen(false);
      } catch (e) {
        console.error('Ошибка удаления посетителя', e);
      }
    }
  };

  const { presentCount, absentCount } = getVisitorCounts();

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <div className="search-add-container">
          <SearchForm onSearch={handleSearch} initialSearch={filters.fullName || ''} />
        </div>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Добавить
        </button>
        <div className="visitor-count">
          <label className="title">Посетители</label>
          <div className="count">
            <span className="present">{presentCount}</span> / <span className="absent">{absentCount}</span>
          </div>
        </div>
      </header>

      <main className="main-container">
        {isLoading ? <p>Загрузка...</p> : <VisitorList
  visitors={visitors}
  onOpenModal={(visitor) => {
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  }}
/>}
      </main>

      <footer className="footer">
        <PresenceFilter onFilter={handlePresenceFilter} initialPresent={filters.present} />
      </footer>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedVisitor(null);
      }}>
        <div className="modal-content-wrapper">
          <VisitorForm
            visitor={selectedVisitor ?? undefined}
            onSubmit={selectedVisitor ? handleEdit : handleAdd}
            onDelete={selectedVisitor ? handleDelete : undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedVisitor(null);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;
