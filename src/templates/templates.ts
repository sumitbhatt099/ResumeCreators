export interface ResumeTemplate {
  id: string;
  name: string;
  previewColor: string;
  description: string;
}

export const templates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    previewColor: '#E0E0E0',
    description: 'Simple & clean layout',
  },
  {
    id: 'modern',
    name: 'Modern',
    previewColor: '#C8E6C9',
    description: 'Stylish with sections',
  },
  {
    id: 'professional',
    name: 'Professional',
    previewColor: '#BBDEFB',
    description: 'Corporate ready design',
  },
];
