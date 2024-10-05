'use client';

import React from 'react';
import {X} from 'lucide-react';

export const DocumentList = ({
  selectedFiles,
  removeFile,
}: {
  selectedFiles: any[];
  removeFile: (file: any) => void;
}) => {
  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold text-gray-700">
        Fichiers sélectionnés:
      </h4>
      <ul className="list-disc pl-5">
        {selectedFiles.map((file, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 flex items-center justify-between">
            <span>{file.name}</span>
            <X
              size={16}
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(file)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
