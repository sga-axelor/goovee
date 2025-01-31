'use client';

import {useEffect} from 'react';

export function FacilitiesView({
  formKey,
  form,
  list,
  isSecondary = false,
  renderItem,
}: {
  formKey: string;
  form: any;
  list: any[];
  isSecondary?: boolean;
  renderItem: (item: any, idx: any) => React.JSX.Element;
}) {
  useEffect(() => {
    const currentValues = form.getValues(formKey);
    if (!Array.isArray(currentValues) || currentValues.length === 0) {
      form.setValue(
        formKey,
        list.map(() => !isSecondary),
        {
          shouldValidate: true,
        },
      );
    }
  }, [form, list, isSecondary, formKey]);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {list.map(({facility, price}, idx) => {
        return renderItem(
          {
            name: facility,
            title: `${facility} (${isSecondary ? '+ ' : ''}${price})`,
            type: 'boolean',
            readonly: !isSecondary,
          },
          `${formKey}.${idx}`,
        );
      })}
    </div>
  );
}

export default FacilitiesView;
