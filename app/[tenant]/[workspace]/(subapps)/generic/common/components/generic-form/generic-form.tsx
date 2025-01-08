'use client';
import {useMemo} from 'react';

import {FormView} from '@/ui/form';
import {formatSchema} from '../../utils/format.helpers';

export const GenericForm = ({
  content,
  metaFields,
}: {
  content: any;
  metaFields: any[];
}) => {
  const {fields, panels} = useMemo(
    () => formatSchema(content?.items, metaFields),
    [content, metaFields],
  );

  return (
    <FormView
      fields={fields}
      panels={panels}
      onSubmit={() => {
        return new Promise(resolve => resolve());
      }}
      submitTitle="Test"
    />
  );
};
