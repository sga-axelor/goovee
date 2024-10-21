'use client';

import React, {useEffect, useState} from 'react';
import {ImagePreview} from '..';
import {File} from '../../../types/types';
import {
  FileIcon,
  FileText,
  Film,
  Image,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import {getFileLink} from '../../../api';

const getFileIconAndColor = (mimeType: string) => {
  if (mimeType.startsWith('image/'))
    return {icon: Image, color: 'text-gray-500'};
  if (mimeType.startsWith('video/'))
    return {icon: Film, color: 'text-blue-500'};
  if (mimeType === 'application/pdf')
    return {icon: FileText, color: 'text-red-500'};
  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel'
  )
    return {icon: FileSpreadsheet, color: 'text-green-500'};
  return {icon: FileIcon, color: 'text-gray-500'};
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

export const FilePreview = ({file, token}: {file: File; token: string}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const isImage = file.mime_type.startsWith('image/');
  const {icon: Icon, color} = getFileIconAndColor(file.mime_type);
  const [publicLink, setPublicLink] = useState<string>('');

  useEffect(() => {
    const fetchLink = async () => {
      const {link} = await getFileLink(file.id, token);
      setPublicLink(link);
    };
    fetchLink();
  }, [file.id, token]);

  return (
    <div className="m-1 flex flex-col items-center relative">
      {isImage ? (
        <ImagePreview file={file} token={token} publicLink={publicLink} />
      ) : (
        <div
          className={`flex items-center p-2 rounded-md w-64 h-16 border border-gray-300 transition-shadow duration-200 ${
            isHovered ? 'shadow-md' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          <Icon className={`w-8 h-8 mr-3 ${color} flex-shrink-0`} />
          <div className="flex flex-col overflow-hidden flex-grow">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          {isHovered && (
            <a
              href={publicLink}
              onMouseEnter={() => setIsDownloadHovered(true)}
              onMouseLeave={() => setIsDownloadHovered(false)}
              className={`ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors duration-200 ${
                isDownloadHovered ? 'bg-blue-100' : ''
              }`}
              aria-label="Télécharger le fichier">
              <Download
                className={`w-5 h-5 ${
                  isDownloadHovered ? 'text-blue-500' : 'text-gray-500'
                } transition-colors duration-200`}
              />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
