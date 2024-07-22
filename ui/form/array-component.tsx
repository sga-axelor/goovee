'use client';

import React, {useCallback, useMemo} from 'react';
import {MdAdd, MdOutlineDelete} from 'react-icons/md';
import {Button} from '../components';
import {Field} from './types';
import {createDefaultValues, sortFields} from './display.helpers';

const ArrayComponent = ({
  form,
  field,
  renderItem,
  formKey,
  addTitle,
}: {
  form: any;
  field: Field;
  renderItem: (item: Field, idx: number) => React.JSX.Element;
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
    _valueId => {
      const _current = form.getValues(field.name) ?? [];

      form.setValue(
        field.name,
        _current.filter(({valueId}) => valueId !== _valueId),
      );
    },
    [field.name, form],
  );

  const renderArrayItem = useCallback(
    (subField, idx) => {
      return (
        <div
          key={subField.valueId}
          className="p-4 flex gap-x-6 border rounded-lg">
          <Button
            onClick={() => removeItem(subField.valueId)}
            type="button"
            size="icon"
            className="size-10 shrink-0 ">
            <MdOutlineDelete className="w-6 h-6" />
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
      <Button
        type="button"
        className="p-2 flex whitespace-normal items-center gap-x-[0.625rem] h-fit max-w-full "
        onClick={addItem}>
        <MdAdd className="w-6 h-6" />
        <p className="text-sm font-normal text-center">{addTitle}</p>
      </Button>
      {(form.watch(field.name) ?? []).map(renderArrayItem)}
    </div>
  );
};

export default ArrayComponent;
