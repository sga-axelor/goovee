'use client';
import React, {useState} from 'react';
import {MdOutlineChevronRight} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {
  JSON_MANY_TO_ONE,
  JSON_MANY_TO_MANY,
  MANY_TO_ONE,
  MANY_T0_MANY,
} from '@/subapps/shop/common/constants';
import {MetaFieldPicture} from '@/subapps/shop/common/ui/components/meta-field-picture';

export function ProductMetaFieldView({fields}: {fields: any[]}) {
  const [expandedFields, setExpandedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleField = (fieldId: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const isImage = (type: string) => {
    if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg') {
      return true;
    }
  };

  const transformValueToArray = (field: any) => ({
    ...field,
    value: Array.isArray(field.value) ? field.value : [field.value],
  });

  const renderFieldMTM = (field: any) => {
    const fieldValue = field.value[0]?.value ?? field.value[0];
    if (fieldValue.fileType && isImage(fieldValue.fileType)) {
      return (
        <div className="w-full">
          <div
            onClick={() => toggleField(field.title)}
            className="flex items-center cursor-pointer gap-2">
            <MdOutlineChevronRight
              className={`transition-transform duration-200 ${
                expandedFields[field.title] ? 'rotate-90' : ''
              }`}
              size={15}
            />
            <span className="font-medium">{field.title}</span>
          </div>
          {expandedFields[field.title] && (
            <div className="ml-7 mt-2 space-y-4">
              {field.value.map((image: any, index: number) => (
                <MetaFieldPicture image={image.value ?? image} key={index} />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const concatValues = field.value
        .map((item: any) => item.value)
        .join(' - ');
      return (
        <div className="flex">
          <div>
            <span className="font-medium">{field.title}</span> : {concatValues}
          </div>
        </div>
      );
    }
  };

  const isManyTo = (type: string) => {
    return (
      type === JSON_MANY_TO_MANY ||
      type === JSON_MANY_TO_ONE ||
      type === MANY_T0_MANY ||
      type === MANY_TO_ONE
    );
  };

  const renderFieldValue = (field: any) => {
    const transFormedField = transformValueToArray(field);
    if (isManyTo(field.type) && field.value) {
      return renderFieldMTM(transFormedField);
    }
    return (
      <div className="flex">
        <div>
          <span className="font-medium">{transFormedField.title}</span> :{' '}
          {transFormedField.value}
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 space-y-1 text-sm">
      {fields
        .filter(field => field.value)
        .map((field, index) => (
          <div key={index}>{renderFieldValue(field)}</div>
        ))}
    </div>
  );
}

export default ProductMetaFieldView;
