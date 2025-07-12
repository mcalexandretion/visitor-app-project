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
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [filters, setFilters] = useState<{ fullName?: string; present?: boolean }>({
    fullName: undefined,
    present: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fullData = await fetchVisitors({ fullName: undefined, present: undefined });
        setAllVisitors(fullData);
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
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [window.location.search]);

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
    const presentCount = allVisitors.filter((v) => v.present).length;
    const absentCount = allVisitors.filter((v) => !v.present).length;
    return { presentCount, absentCount };
  };

  const handleOpenModal = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
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
      const updatedAllVisitors = [...allVisitors, newVisitor];
      setAllVisitors(updatedAllVisitors);
      setVisitors(updatedAllVisitors.filter((v) => !filters.present || v.present === filters.present));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const handleEdit = async (data: Omit<Visitor, 'id'>) => {
    if (!selectedVisitor) return;
    try {
      const updatedVisitor = await updateVisitor(selectedVisitor.id, data);
      const updatedAllVisitors = allVisitors.map((v) =>
        v.id === updatedVisitor.id ? updatedVisitor : v
      );
      setAllVisitors(updatedAllVisitors);
      setVisitors(updatedAllVisitors.filter((v) => !filters.present || v.present === filters.present));
      setIsModalOpen(false);
      setSelectedVisitor(null);
    } catch (error) {
      console.error('Error editing visitor:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedVisitor) return;
    if (window.confirm('Вы уверены, что хотите удалить этого посетителя?')) {
      try {
        await deleteVisitor(selectedVisitor.id);
        const updatedAllVisitors = allVisitors.filter((v) => v.id !== selectedVisitor.id);
        setAllVisitors(updatedAllVisitors);
        setVisitors(updatedAllVisitors.filter((v) => !filters.present || v.present === filters.present));
        setIsModalOpen(false);
        setSelectedVisitor(null);
      } catch (error) {
        console.error('Error deleting visitor:', error);
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
         <div className="count"><span className="present">{presentCount}</span> / <span className="absent">{absentCount}</span></div>

         </div>
      </header>

      <main className="main-container">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <VisitorList visitors={visitors} onOpenModal={handleOpenModal} />
        )}
      </main>

      <footer className="footer">
        <PresenceFilter onFilter={handlePresenceFilter} initialPresent={filters.present} />
      </footer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVisitor(null);
        }}
      >
        {selectedVisitor ? (
          <div className="modal-content-wrapper">
            <VisitorForm
              visitor={selectedVisitor}
              onSubmit={handleEdit}
              onDelete={handleDelete}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedVisitor(null);
              }}
            />
          </div>
        ) : (
          <div className="modal-content-wrapper">
            <VisitorForm
              visitor={undefined}
              onSubmit={handleAdd}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedVisitor(null);
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;