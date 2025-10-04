export interface Profile {
  id: string;
  full_name: string;
  role: 'central_analyst' | 'supervisor' | 'field_personnel' | 'public';
  organization: string;
  location: string;
  site_id?: string; // For field personnel assigned to specific monitoring sites
  created_at?: string;
  is_active?: boolean;
}