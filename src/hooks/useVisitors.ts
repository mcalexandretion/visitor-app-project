import { useEffect, useState } from 'react';
import { fetchVisitors } from '../services/api';
import { parseFiltersFromUrl, updateUrl } from '../utils/url';
import type { Visitor } from '../types/visitor';

type Filters = { fullName?: string; present?: boolean };

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadVisitors = async (newFilters: Filters) => {
    try {
      const data = await fetchVisitors(newFilters);
      setVisitors(data);
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const all = await fetchVisitors({});
        setAllVisitors(all);
        const urlFilters = parseFiltersFromUrl();
        setFilters(urlFilters);
        await loadVisitors(urlFilters);
      } catch (e) {
        console.error('Error initializing data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [window.location.search]);

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    updateUrl(newFilters);
    loadVisitors(newFilters);
  };

  return {
    visitors,
    allVisitors,
    filters,
    isLoading,
    setAllVisitors,
    setVisitors,
    setFilters: updateFilters,
    loadVisitors,
  };
};
