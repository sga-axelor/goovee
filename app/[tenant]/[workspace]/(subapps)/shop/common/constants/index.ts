import {i18n} from '@/i18n';

export const SORT_BY_OPTIONS = [
  {
    value: 'byNewest',
    label: i18n.get('New'),
  },
  {
    value: 'byFeature',
    label: i18n.get('Featured'),
  },
  {
    value: 'byAToZ',
    label: i18n.get('Name: A-Z'),
  },
  {
    value: 'byZToA',
    label: i18n.get('Name: Z-A'),
  },
  {
    value: 'byLessExpensive',
    label: i18n.get('Price: Low-High'),
  },
  {
    value: 'byMostExpensive',
    label: i18n.get('Price: High-Low'),
  },
];
