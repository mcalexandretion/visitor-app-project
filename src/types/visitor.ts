export interface Visitor {
  id: string;
  fullName: string;
  company: string;
  group: 'Прохожий' | 'Клиент' | 'Партнер';
  present: boolean;
}