'use client';
import Image from 'next/image';
import React from 'react';
import {MdOutlineEdit} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CHOOSE_GROUP,
  ENTER_TITLE,
  FILE_TITLE,
  FORUM_GROUP,
  SELECT_A_GROUP,
  TITLE,
} from '@/subapps/forum/common/constants';
import {PdfViewer} from '@/subapps/forum/common/ui/components';

interface FileDescProps {
  file: File | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileDesc = ({file, handleFileUpload}: FileDescProps) => {
  return (
    <div className="flex flex-col gap-2 xl:gap-4">
      <div>
        <Label className="text-base">{i18n.get(TITLE)}</Label>
        <Input
          placeholder={ENTER_TITLE}
          className="mt-2 h-10 xl:h-12 shadow-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-base font-medium">
          {i18n.get(CHOOSE_GROUP)}
        </Label>
        <Select>
          <SelectTrigger className="w-full h-11 shadow-none">
            <SelectValue placeholder={SELECT_A_GROUP} />
          </SelectTrigger>
          <SelectContent>
            {FORUM_GROUP.map(item => (
              <SelectItem value={item.name} key={item.id}>
                <div className="flex items-center center justify-center gap-3 ">
                  <div className="w-6 h-6 rounded-lg overflow-hidden relative">
                    <Image
                      fill
                      src="/images/upload.png"
                      alt="group avatar"
                      objectFit="cover"
                    />
                  </div>
                  <div className="font-normal text-sm text-muted-foreground">
                    {item.name}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-md">{i18n.get(FILE_TITLE)}</Label>
        <Input
          placeholder="Enter File Title"
          className="mt-2 h-10 xl:h-12 shadow-none"
        />
      </div>
      <div className="p-2 self-end cursor-pointer">
        <Label htmlFor="file-upload">
          <MdOutlineEdit className="w-5 h-5 font-medium" />
        </Label>
      </div>
      {file?.type === 'application/pdf' ? (
        <PdfViewer file={file} />
      ) : (
        <div className="px-2 border h-10 xl:h-12 flex items-center font-xl mb-2 rounded-md gap-2">
          <div className="w-6 h-6 rounded-lg relative">
            <Image
              fill
              src={
                file?.type === 'application/msword'
                  ? '/images/doc.jpeg'
                  : '/images/xlsx.jpeg'
              }
              alt={file?.type || 'file type'}
              objectFit="cover"
            />
          </div>
          {file?.name}
        </div>
      )}
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
