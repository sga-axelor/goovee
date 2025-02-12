'use client';

import React, {ReactNode, useCallback, useMemo} from 'react';
import {MdAdd, MdOutlineDelete} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import type {Field} from '@/ui/form';
import {createDefaultValues, sortFields} from '@/ui/form';
import {i18n} from '@/locale';

export const ArrayComponent = ({
  form,
  field,
  renderItem,
  renderAddMore,
}: {
  form: any;
  field: Field;
  renderItem: (item: any, idx: any) => React.JSX.Element;
  renderAddMore?: ({addItem}: {addItem: () => void}) => ReactNode;
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
        <div className="border rounded-lg p-4 ">
          <h3 className="text-lg font-semibold leading-6 tracking-tight mb-2">
            {i18n.t('Participant')} #{idx + 2}
          </h3>
          <div key={subField.valueId} className="flex gap-6 ">
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
        </div>
      );
    },
    [visibleChildrenFields, field.name, removeItem, renderItem],
  );

  return (
    <div className="space-y-6">
      {(form.watch(field.name) ?? []).map(renderArrayItem)}
      {renderAddMore?.({addItem})}
    </div>
  );
};
