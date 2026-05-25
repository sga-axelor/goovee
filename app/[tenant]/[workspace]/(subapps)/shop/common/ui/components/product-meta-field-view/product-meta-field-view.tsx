'use client';
import {useState} from 'react';
import {MdOutlineChevronRight} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import type {ID, MetaFile} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {MetaFieldPicture} from '@/subapps/shop/common/ui/components/meta-field-picture';
import {isRelationalType} from '@/subapps/shop/common/utils';
import type {
  MetaFieldWithValue,
  FieldValueItem,
} from '@/subapps/shop/common/types';

export function ProductMetaFieldView({
  fields,
  productId,
}: {
  fields: MetaFieldWithValue[];
  productId: ID;
}) {
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

  const transformValueToArray = (field: MetaFieldWithValue) => ({
    ...field,
    value: (Array.isArray(field.value)
      ? field.value
      : [field.value]) as FieldValueItem[],
  });

  const renderFieldMTM = (
    field: MetaFieldWithValue & {value: FieldValueItem[]},
  ) => {
    const fieldValue = field.value[0]?.value ?? field.value[0];
    const titleKey = field.title ?? '';
    if (fieldValue?.fileType && isImage(fieldValue.fileType)) {
      return (
        <div className="w-full">
          <div
            onClick={() => toggleField(titleKey)}
            className="flex items-center cursor-pointer gap-2">
            <MdOutlineChevronRight
              className={`transition-transform duration-200 ${
                expandedFields[titleKey] ? 'rotate-90' : ''
              }`}
              size={15}
            />
            <span className="font-medium">{field.title}</span>
          </div>
          {expandedFields[titleKey] && (
            <div className="ml-7 mt-2 space-y-4">
              {field.value.map((image, index) => (
                <MetaFieldPicture
                  image={(image.value ?? image) as MetaFile}
                  key={index}
                  productId={productId}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const concatValues = field.value
        .map(item => String(item.value ?? item.fileName ?? ''))
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

  const renderFieldValue = (field: MetaFieldWithValue) => {
    const transFormedField = transformValueToArray(field);
    if (isRelationalType(field.type) && field.value) {
      return renderFieldMTM(transFormedField);
    }
    return (
      <div className="flex">
        <div>
          <span className="font-medium">{transFormedField.title}</span> :{' '}
          {String(field.value ?? '')}
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
