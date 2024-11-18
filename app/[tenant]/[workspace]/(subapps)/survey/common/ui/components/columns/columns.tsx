// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {Survey} from '@/subapps/survey/common/types';
import {Status} from '@/subapps/survey/common/ui/components';
import {getStatusName, getSurveyTypeName} from '@/subapps/survey/common/utils';

export const Columns = [
  {
    key: 'name',
    label: i18n.get('Name'),
    sortable: true,
    mobile: true,
    getter: (row: Survey) => row.name,
    content: (row: any) => row.name,
  },
  {
    key: 'statusSelect',
    label: i18n.get('Status'),
    mobile: true,
    getter: (row: Survey) => row.statusSelect,
    content: (row: Survey) => (
      <Status value={getStatusName(row.statusSelect)} />
    ),
  },
  {
    key: 'type',
    label: i18n.get('Type'),
    getter: (row: Survey) => row.typeSelect,
    content: (row: any) => <Status value={getSurveyTypeName(row.typeSelect)} />,
  },
  {
    key: 'category',
    label: i18n.get('Category'),
    getter: (row: Survey) => row.category,
    content: (row: any) => row.category,
  },
  {
    key: 'publicationDatetime',
    label: i18n.get('Publication date'),
    getter: (row: Survey) => row.publicationDatetime,
    content: (row: any) => row.publicationDatetime,
  },
];
