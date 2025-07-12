import { useEffect, useState, useCallback } from 'react';
import { fetchVisitors } from '../services/api';
import { parseFiltersFromUrl, updateUrl } from '../utils/url';
import type { Visitor } from '../types/visitor';

type Filters = { fullName?: string; present?: boolean };

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadVisitors = useCallback(async (newFilters: Filters) => {
    try {
      const data = await fetchVisitors(newFilters);
      setVisitors(data);
    } catch (error) {
      console.error('Ошибка загрузки посетителей', error);
    }
  }, []);

  useEffect(() => {
const init = async () => {
  setIsLoading(true);
  try {
    const urlFilters = parseFiltersFromUrl();
    setFilters(urlFilters);

    const [all, filtered] = await Promise.all([
      fetchVisitors({}),
      fetchVisitors(urlFilters),
    ]);

    setAllVisitors(all);
    setVisitors(filtered);
  } catch (e) {
    console.error('ошибка загрузки данных', e);
  } finally {
    setIsLoading(false);
  }
};

    init();
  }, []); 

const updateFilters = useCallback((newFilters: Filters) => {
  setFilters((prev) => {
    if (
      prev.fullName === newFilters.fullName &&
      prev.present === newFilters.present
    ) {
      return prev; 
    }

    updateUrl(newFilters);
    loadVisitors(newFilters);
    return newFilters;
  });
}, [loadVisitors]);

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