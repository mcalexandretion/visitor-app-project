import type { Visitor } from '../types/visitor';

const API_URL = 'http://localhost:3000/visitors';

export const fetchVisitors = async (filters: {
  fullName?: string;
  present?: boolean;
}): Promise<Visitor[]> => {
  const params = new URLSearchParams();
  if (filters.fullName) params.append('fullName_like', filters.fullName);
  if (filters.present !== undefined) params.append('present', filters.present.toString());
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch visitors');
  return response.json();
};

export const createVisitor = async (visitor: Omit<Visitor, 'id'>): Promise<Visitor> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...visitor, id: crypto.randomUUID() }),
  });
  if (!response.ok) throw new Error('Failed to create visitor');
  return response.json();
};

export const updateVisitor = async (id: string, visitor: Partial<Visitor>): Promise<Visitor> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitor),
  });
  if (!response.ok) throw new Error('Failed to update visitor');
  return response.json();
};

export const deleteVisitor = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete visitor');
};