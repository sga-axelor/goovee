import React, {useState} from 'react';
import {MdClose} from 'react-icons/md';
import Image from 'next/image';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Button, ScrollArea} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {FileDesc} from '@/subapps/forum/common/ui/components';
import {
  CLICK_HERE_DRAG_DROP_FILE,
  SUPPORTED_FILE_PDF_DOC,
  UPLOAD,
} from '@/subapps/forum/common/constants';

interface FileUploaderProps {
  handleClose: () => void;
}

export const FileUploader = ({handleClose}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  return (
    <div className="bg-white w-full h-screen lg:h-full z-[100]">
      <ScrollArea
        className={`relative w-full ${file?.type === 'application/pdf' ? 'h-[90vh]' : 'h-fit'} pt-8`}>
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full p-px absolute top-0 right-0 cursor-pointer"
          onClick={handleClose}>
          <MdClose className="h-full w-full text-muted-foreground" />
        </button>
        <div className="flex flex-col w-full h-full">
          <div
            className={`flex flex-col items-center gap-2 my-4 flex-1 p-2 justify-between`}
            onDrop={handleDrop}
            onDragOver={event => event.preventDefault()}>
            {file === null ? (
              <label
                htmlFor="file-upload"
                className="w-full rounded-sm  border flex flex-col gap-2 md:gap-4 items-center justify-center h-full cursor-pointer p-2">
                <div className="w-[385px] h-[293px] relative my-2">
                  <Image
                    fill
                    src={'/images/upload.png'}
                    className="aspect-auto"
                    objectFit="contain"
                    alt="Upload png"
                  />
                </div>
                <h2>{i18n.get(CLICK_HERE_DRAG_DROP_FILE)}</h2>
                <span className="text-muted-foreground">
                  {i18n.get(SUPPORTED_FILE_PDF_DOC)}
                </span>
              </label>
            ) : (
              <div className="flex flex-col gap-2 w-full px-2">
                <FileDesc handleFileUpload={handleFileUpload} file={file} />
              </div>
            )}
            <Button className="bg-success w-full rounded-md h-10 mt-4">
              {i18n.get(UPLOAD)}
            </Button>
          </div>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileUpload}
        />
      </ScrollArea>
    </div>
  );
};
