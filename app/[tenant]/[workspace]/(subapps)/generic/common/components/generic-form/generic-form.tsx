'use client';

import {FormView} from '@/ui/form';

export const GenericForm = ({
  fields,
  panels,
}: {
  fields: any[];
  panels?: any[];
}) => {
  return (
    <FormView
      fields={fields}
      panels={panels}
      onSubmit={console.log as any}
      submitTitle={'Hello'}
    />
  );
};
