'use client';

import {FormView} from '@/ui/form';

export const GenericForm = ({
  fields,
  panels,
  data,
}: {
  fields: any[];
  panels?: any[];
  data?: any;
}) => {
  return (
    <FormView
      fields={fields}
      panels={panels}
      defaultValue={data}
      onSubmit={console.log as any}
      submitTitle={'Hello'}
    />
  );
};
