
// Quick Link types
export interface QuickLink {
  _id?: string;
  title: string;
  url: string;
  icon?: string; // Lucide icon name
  isActive: boolean;
  order?: number;
  time:Date;
  createdAt: string;
  updatedAt?: string;
}
