// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {Response, Survey} from '@/subapps/survey/common/types';
import {Chip} from '@/subapps/survey/common/ui/components';
import {
  getResponseStatusName,
  getStatusName,
  getSurveyTypeName,
} from '@/subapps/survey/common/utils';

export const surveyColumns = [
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
      <Chip value={getStatusName(row.statusSelect)} outline={true} />
    ),
  },
  {
    key: 'type',
    label: i18n.get('Type'),
    getter: (row: Survey) => row.typeSelect,
    content: (row: any) => (
      <Chip value={getSurveyTypeName(row.typeSelect)} outline={true} />
    ),
  },
  {
    key: 'category',
    label: i18n.get('Category'),
    getter: (row: Survey) => row.category?.name,
    content: (row: any) => (
      <Chip value={row.category?.name} variant="purple" className="rounded" />
    ),
  },
  {
    key: 'publicationDatetime',
    label: i18n.get('Publication date'),
    getter: (row: Survey) => row.publicationDatetime,
    content: (row: any) => row.publicationDatetime,
  },
];

export const partnerResponseColumns = [
  {
    key: 'survey',
    label: i18n.get('Survey'),
    sortable: true,
    mobile: true,
    getter: (row: Response) => row.attrs?.surveyConfig?.name,
    content: (row: Response) => row.attrs?.surveyConfig?.name,
  },
  {
    key: 'statusSelect',
    label: i18n.get('Survey status'),
    getter: (row: Response) => row.attrs?.surveyConfig?.statusSelect,
    content: (row: Response) => (
      <Chip
        value={getStatusName(row.attrs?.surveyConfig?.statusSelect)}
        outline={true}
      />
    ),
  },
  {
    key: 'category',
    label: i18n.get('Category'),
    getter: (row: Response) => row.attrs?.surveyConfig?.category?.name,
    content: (row: Response) => (
      <Chip
        value={row.attrs?.surveyConfig?.category?.name}
        variant="purple"
        className="rounded"
      />
    ),
  },
  {
    key: 'publicationDatetime',
    label: i18n.get('Publication date'),
    getter: (row: Response) => row.attrs?.surveyConfig?.publicationDatetime,
    content: (row: Response) => row.attrs?.surveyConfig?.publicationDatetime,
  },
  {
    key: 'attrsStatusSelect',
    label: i18n.get('Response status'),
    mobile: true,
    getter: (row: Response) => row.attrs?.statusSelect,
    content: (row: Response) => (
      <Chip
        value={getResponseStatusName(row.attrs?.statusSelect)}
        outline={true}
      />
    ),
  },
];
