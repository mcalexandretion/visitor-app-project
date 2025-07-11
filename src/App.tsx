import { useState, useEffect } from 'react';
import type { Visitor } from './types/visitor';
import { fetchVisitors, createVisitor, updateVisitor, deleteVisitor } from './services/api';
import { VisitorList } from './components/VisitorList';
import { VisitorForm } from './components/VisitorForm';
import { Modal } from './components/Modal';
import { SearchForm } from './components/SearchForm';
import { PresenceFilter } from './components/PresenceFilter';
import './index.css';
import logo from'./assets/logo.png';
function App() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [filters, setFilters] = useState<{ fullName?: string; present?: boolean }>({});

  useEffect(() => {
    // Загрузка фильтров из URL при монтировании
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get('fullName') || '';
    const present = params.get('present');
    setFilters({
      fullName: fullName || undefined,
      present: present === 'true' ? true : present === 'false' ? false : undefined,
    });
  }, []);

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const data = await fetchVisitors(filters);
        setVisitors(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadVisitors();
  }, [filters]);

  const handleSearch = (fullName: string) => {
    const newFilters = { ...filters, fullName: fullName || undefined };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handlePresenceFilter = (present: boolean | undefined) => {
    const newFilters = { ...filters, present };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const updateUrl = (filters: { fullName?: string; present?: boolean }) => {
    const params = new URLSearchParams();
    if (filters.fullName) params.set('fullName', filters.fullName);
    if (filters.present !== undefined) params.set('present', filters.present.toString());
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleAdd = async (data: Omit<Visitor, 'id'>) => {
    try {
      const newVisitor = await createVisitor(data);
      setVisitors([...visitors, newVisitor]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (data: Omit<Visitor, 'id'>) => {
    if (!editingVisitor) return;
    try {
      const updatedVisitor = await updateVisitor(editingVisitor.id, data);
      setVisitors(visitors.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v)));
      setIsModalOpen(false);
      setEditingVisitor(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVisitor(id);
      setVisitors(visitors.filter((v) => v.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <img src={logo} alt='logo' className="logo"/>
        <SearchForm onSearch={handleSearch} initialSearch={filters.fullName || ''} />
        <button onClick={() => setIsModalOpen(true)}>Добавить</button>
      </div>
    
      <div className='main-container'>
<VisitorList
        visitors={visitors}
        onEdit={(visitor) => {
          setEditingVisitor(visitor);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingVisitor(null); }}>
        <VisitorForm
          visitor={editingVisitor || undefined}
          onSubmit={editingVisitor ? handleEdit : handleAdd}
          onClose={() => { setIsModalOpen(false); setEditingVisitor(null); }}
        />
      </Modal>
      </div>
      
      <div className="footer">
<PresenceFilter onFilter={handlePresenceFilter} initialPresent={filters.present} />
      </div>
    </div>
  );
}

export default App;