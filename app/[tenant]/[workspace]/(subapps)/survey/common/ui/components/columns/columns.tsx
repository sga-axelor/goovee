// ---- CORE IMPORTS ---- //
import {DATE_FORMATS} from '@/constants';
import {i18n} from '@/locale';
import {formatDate} from '@/locale/formatters';

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
    sortable: true,
    getter: (row: Survey) =>
      formatDate(row.publicationDatetime, {
        dateFormat: DATE_FORMATS.DD_MM_YYYY,
      }),
    content: (row: any) =>
      formatDate(row.publicationDatetime, {
        dateFormat: DATE_FORMATS.DD_MM_YYYY,
      }),
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
    key: 'responseDate',
    label: i18n.t('Response date'),
    sortable: true,
    getter: (row: Response) =>
      formatDate(row.updatedOn ?? row.createdOn, {
        dateFormat: DATE_FORMATS.DD_MM_YYYY,
      }),
    content: (row: Response) =>
      formatDate(row.updatedOn ?? row.createdOn, {
        dateFormat: DATE_FORMATS.DD_MM_YYYY,
      }),
  },
];
