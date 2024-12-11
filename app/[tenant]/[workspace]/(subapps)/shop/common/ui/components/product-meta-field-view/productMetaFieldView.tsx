'use client';
import React, {useState} from 'react';
import {MdOutlineChevronRight} from 'react-icons/md';
import {MetaFieldPicture} from '../MetafieldPicture';

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

  const isImage = (type: string) => {
    console.log('le type : ', type);
    if (type === 'image/png') {
      return true;
    }
  };

  const renderFieldMTM = (field: any) => {
    const fieldValue = field.value[0].value;
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
              {Array.isArray(field.value) ? (
                field.value.map((image, index) => (
                  <MetaFieldPicture image={image.value} key={index} />
                ))
              ) : (
                <MetaFieldPicture image={field.value.value} />
              )}
            </div>
          )}
        </div>
      );
    }
  };

  const renderFieldValueMTO = (field: any) => {
    const fieldValue = field.value.value;
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
            <div className="ml-7 mt-2">
              <MetaFieldPicture image={fieldValue} />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex">
          <div>
            <span className="font-medium">{field.title}</span> : {fieldValue}
          </div>
        </div>
      );
    }
  };

  const renderFieldValue = (field: any) => {
    console.log('fieldfield', field);
    if (field.type === 'json-many-to-one' && field.value) {
      return renderFieldValueMTO(field);
    } else if (field.type === 'json-many-to-many') {
      return renderFieldMTM(field);
    } else if (field.type === 'json-many-to-many') {
      return (
        <div className="flex">
          <div>
            <span className="font-medium">coucou</span> : coucou
          </div>
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
