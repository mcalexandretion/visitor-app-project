type Filters = { fullName?: string; present?: boolean };

export const parseFiltersFromUrl = (): Filters => {
  const params = new URLSearchParams(window.location.search);
  const fullName = params.get('fullName') || undefined;
  const present = params.get('present');

  return {
    fullName,
    present: present === 'true' ? true : present === 'false' ? false : undefined,
  };
};

export const updateUrl = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.fullName) params.set('fullName', filters.fullName);
  if (filters.present !== undefined) params.set('present', filters.present.toString());
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
};
