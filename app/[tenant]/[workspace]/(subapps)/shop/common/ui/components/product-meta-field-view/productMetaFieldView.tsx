'use client';
import React, {useState} from 'react';
import {MdOutlineChevronRight} from 'react-icons/md';

export function ProductMetaFieldView({
  fields,
  productAttrs,
}: {
  fields: any[];
  productAttrs: string;
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

  const renderFieldValue = (field: any) => {
    if (field.type === 'json-many-to-one' && field.value) {
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
            <div className="ml-7 mt-2">
              <img
                src={`${process.env.NEXT_PUBLIC_AOS_URL}/ws/rest/com.axelor.meta.db.MetaFile/${field.value[0].image.id}/content/download`}
                alt={field.value.name || 'Image'}
                className="w-64 h-64 object-contain rounded"
              />
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex">
        <div>
          <span className="font-medium">{field.title}</span> : {field.value}
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 space-y-1 text-sm">
      {fields.map((field, index) => (
        <div key={index}>{renderFieldValue(field)}</div>
      ))}
    </div>
  );
}

export default ProductMetaFieldView;
