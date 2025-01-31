// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {Response, Survey} from '@/subapps/survey/common/types';
import {Chip} from '@/subapps/survey/common/ui/components';
import {
  getResponseStatusName,
  getStatusName,
} from '@/subapps/survey/common/utils';

export const surveyColumns = [
  {
    key: 'name',
    label: i18n.t('Name'),
    sortable: true,
    mobile: true,
    getter: (row: Survey) => row.name,
    content: (row: any) => row.name,
  },
  {
    key: 'category',
    label: i18n.t('Category'),
    getter: (row: Survey) => row.category?.name,
    content: (row: any) => (
      <Chip value={row.category?.name} variant="purple" className="rounded" />
    ),
  },
  {
    key: 'publicationDatetime',
    label: i18n.t('Publication date'),
    getter: (row: Survey) => row.publicationDatetime,
    content: (row: any) => row.publicationDatetime,
  },
  {
    key: 'nbResponses',
    label: i18n.t('Number of responses'),
    getter: (row: Survey) => row.nbResponses,
    content: (row: any) => (
      <Chip value={row.nbResponses} variant="success" className="rounded" />
    ),
  },
];

export const partnerResponseColumns = [
  {
    key: 'survey',
    label: i18n.t('Survey'),
    sortable: true,
    mobile: true,
    getter: (row: Response) => row.attrs?.surveyConfig?.name,
    content: (row: Response) => row.attrs?.surveyConfig?.name,
  },
  {
    key: 'statusSelect',
    label: i18n.t('Survey status'),
    getter: (row: Response) => row.attrs?.surveyConfig?.statusSelect,
    content: (row: Response) => (
      <Chip
        value={i18n.t(getStatusName(row.attrs?.surveyConfig?.statusSelect))}
        outline={true}
      />
    ),
  },
  {
    key: 'category',
    label: i18n.t('Category'),
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
    label: i18n.t('Publication date'),
    getter: (row: Response) => row.attrs?.surveyConfig?.publicationDatetime,
    content: (row: Response) => row.attrs?.surveyConfig?.publicationDatetime,
  },
  {
    key: 'attrsStatusSelect',
    label: i18n.t('Response status'),
    mobile: true,
    getter: (row: Response) => row.attrs?.statusSelect,
    content: (row: Response) => (
      <Chip
        value={i18n.t(getResponseStatusName(row.attrs?.statusSelect))}
        outline={true}
      />
    ),
  },
];
