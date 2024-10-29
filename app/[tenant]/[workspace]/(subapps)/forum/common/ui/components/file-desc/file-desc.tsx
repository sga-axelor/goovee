'use client';

import React from 'react';
import {MdOutlineEdit} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Input, Label} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {FILE_TITLE} from '@/subapps/forum/common/constants';
import {FilePreviewer} from '@/subapps/forum/common/ui/components';

interface FileDescProps {
  fileDetails: any;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileDesc = ({
  fileDetails,
  onChange,
  handleFileUpload,
}: FileDescProps) => {
  return (
    <div className="flex flex-col gap-2 xl:gap-4">
      <div>
        <Label className="text-md">{i18n.get(FILE_TITLE)}</Label>
        <Input
          name="fileTitle"
          placeholder={i18n.get('Enter file title')}
          className="mt-2 h-10 xl:h-12 shadow-none"
          value={fileDetails?.fileTitle}
          onChange={onChange}
        />
      </div>
      <div className="p-2 self-end cursor-pointer">
        <Label htmlFor="file-upload">
          <MdOutlineEdit className="w-5 h-5 font-medium" />
        </Label>
      </div>
      {fileDetails && <FilePreviewer file={fileDetails.file} />}
      <input
        id="file-upload"
        type="file"
        accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};
