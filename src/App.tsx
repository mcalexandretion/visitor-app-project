import { useState, useEffect } from 'react';
import type { Visitor } from './types/visitor';
import { fetchVisitors, createVisitor, updateVisitor, deleteVisitor } from './services/api';
import { VisitorList } from './components/VisitorList';
import { VisitorForm } from './components/VisitorForm';
import { Modal } from './components/Modal';
import { SearchForm } from './components/SearchForm';
import { PresenceFilter } from './components/PresenceFilter';
import './index.css';
import logo from './assets/logo.png';

function App() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [filters, setFilters] = useState<{ fullName?: string; present?: boolean }>({
    fullName: undefined,
    present: undefined,
  });
  const [isLoading, setIsLoading] = useState(true); 

  
  useEffect(() => {
    const loadDataFromUrl = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(window.location.search);
      const fullName = params.get('fullName') || undefined;
      const present = params.get('present');
      const newFilters = {
        fullName,
        present: present === 'true' ? true : present === 'false' ? false : undefined,
      };
      console.log('URL Filters on load:', newFilters);
      setFilters(newFilters);
      await loadVisitors(newFilters);
      setIsLoading(false);
    };
    loadDataFromUrl();
  }, [window.location.search]);

  // Загрузка посетителей с фильтрами
  const loadVisitors = async (filters: { fullName?: string; present?: boolean }) => {
    try {
      console.log('Fetching visitors with filters:', filters);
      const data = await fetchVisitors(filters);
      console.log('Fetched visitors:', data);
      setVisitors(data);
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
  };

  const getVisitorCounts = () => {
    const presentCount = visitors.filter((v) => v.present).length;
    const absentCount = visitors.filter((v) => !v.present).length;
    return { presentCount, absentCount };
  };

  const handleSearch = (fullName: string) => {
    const newFilters = { ...filters, fullName: fullName || undefined };
    console.log('Search filters:', newFilters);
    setFilters(newFilters);
    updateUrl(newFilters);
    loadVisitors(newFilters);
  };

  const handlePresenceFilter = (present: boolean | undefined) => {
    const newFilters = { ...filters, present };
    console.log('Presence filter:', newFilters);
    setFilters(newFilters);
    updateUrl(newFilters);
    loadVisitors(newFilters);
  };

  const updateUrl = (filters: { fullName?: string; present?: boolean }) => {
    const params = new URLSearchParams();
    if (filters.fullName) params.set('fullName', filters.fullName);
    if (filters.present !== undefined) params.set('present', filters.present.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    console.log('Updated URL:', newUrl);
    window.history.pushState({}, document.title, newUrl);
  };

  const handleAdd = async (data: Omit<Visitor, 'id'>) => {
    try {
      const newVisitor = await createVisitor(data);
      setVisitors([...visitors, newVisitor]);
      setIsModalOpen(false);
      loadVisitors(filters);
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const handleEdit = async (data: Omit<Visitor, 'id'>) => {
    if (!editingVisitor) return;
    try {
      const updatedVisitor = await updateVisitor(editingVisitor.id, data);
      setVisitors(visitors.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v)));
      setIsModalOpen(false);
      setEditingVisitor(null);
      loadVisitors(filters);
    } catch (error) {
      console.error('Error editing visitor:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVisitor(id);
      setVisitors(visitors.filter((v) => v.id !== id));
      loadVisitors(filters);
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  };

  const { presentCount, absentCount } = getVisitorCounts();

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <div className="search-add-container">
          <SearchForm onSearch={handleSearch} initialSearch={filters.fullName || ''} />
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Добавить
          </button>
        </div>
        <div className="visitor-count">Посетителей: {presentCount}/{absentCount}</div>
      </header>

      <main className="main-container">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <>
            <VisitorList
              visitors={visitors}
              onEdit={(visitor) => {
                setEditingVisitor(visitor);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingVisitor(null);
              }}
            >
              <VisitorForm
                visitor={editingVisitor || undefined}
                onSubmit={editingVisitor ? handleEdit : handleAdd}
                onClose={() => {
                  setIsModalOpen(false);
                  setEditingVisitor(null);
                }}
              />
            </Modal>
          </>
        )}
      </main>

      <footer className="footer">
        <PresenceFilter onFilter={handlePresenceFilter} initialPresent={filters.present} />
      </footer>
    </div>
  );
}

export default App;