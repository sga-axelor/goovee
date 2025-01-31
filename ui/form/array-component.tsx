'use client';

import React, {useCallback, useMemo} from 'react';
import {MdAdd, MdOutlineDelete} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import type {Field} from '@/ui/form';
import {createDefaultValues, sortFields} from '@/ui/form';

export const ArrayComponent = ({
  form,
  field,
  renderItem,
  addTitle,
}: {
  form: any;
  field: Field;
  renderItem: (item: any, idx: any) => React.JSX.Element;
  addTitle?: string;
}) => {
  const childrenForm = useMemo(
    () => sortFields(field.subSchema),
    [field.subSchema],
  );

  const childrenDefaultValue = useMemo(
    () => createDefaultValues(childrenForm),
    [childrenForm],
  );

  const visibleChildrenFields = useMemo(
    () => childrenForm.filter(_f => !_f.hidden),
    [childrenForm],
  );

  const addItem = useCallback(() => {
    const _current = form.getValues(field.name) ?? [];

    form.setValue(field.name, [
      ..._current,
      {
        ...childrenDefaultValue,
        valueId: -_current.length,
        fromParticipant: false,
      },
    ]);
  }, [childrenDefaultValue, field.name, form]);

  const removeItem = useCallback(
    (_valueId: any) => {
      const _current = form.getValues(field.name) ?? [];

      form.setValue(
        field.name,
        _current.filter(({valueId}: any) => valueId !== _valueId),
      );
    },
    [field.name, form],
  );

  const renderArrayItem = useCallback(
    (subField: any, idx: any) => {
      return (
        <div
          key={subField.valueId}
          className="p-4 flex gap-6 border rounded-lg">
          <Button
            onClick={() => removeItem(subField.valueId)}
            type="button"
            size="icon"
            className={`bg-destructive-dark/20 hover:bg-destructive-dark/40 w-10 h-10 p-2`}>
            <MdOutlineDelete className="w-6 h-6 text-destructive-dark" />
          </Button>
          <div className="space-y-6 w-full">
            {visibleChildrenFields.map(_i =>
              renderItem(_i, `${field.name}.${idx}.${_i.name}`),
            )}
          </div>
        </div>
      );
    },
    [visibleChildrenFields, field.name, removeItem, renderItem],
  );

  return (
    <div className="space-y-6">
      {(form.watch(field.name) ?? []).map(renderArrayItem)}
      <Button
        type="button"
        className={`bg-success-light hover:bg-success p-2 flex whitespace-normal items-center gap-2 h-fit max-w-full group`}
        onClick={addItem}>
        <MdAdd className="w-6 h-6 text-success group-hover:text-white" />
        <p className="text-sm font-normal text-center text-black">{addTitle}</p>
      </Button>
    </div>
  );
};

export default ArrayComponent;
