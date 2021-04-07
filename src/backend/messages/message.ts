export interface Message {
  id: number;
  type: string;
  tag?: any;
  author?: string;
  value: string;
}