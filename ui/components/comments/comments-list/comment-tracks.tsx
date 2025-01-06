'use client';

import React from 'react';
import {MdArrowRightAlt} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

interface Track {
  title: string;
  oldValue?: string;
  value: string;
}

interface CommentTracksProps {
  tracks: Track[];
  title: string;
}

export function CommentTracks({tracks, title}: CommentTracksProps) {
  return (
    <div className="px-4 text-xs mb-1">
      <div className="font-semibold mb-1 -ml-9">{i18n.t(title)}</div>
      <ul className="list-disc">
        {tracks?.map(({title, oldValue, value}, index) => {
          if (title === 'comment.note') return;
          return (
            <li key={index} className="mb-1">
              <div className="flex items-center">
                <span className="font-semibold flex-shrink-0">
                  {i18n.t(title)}:
                </span>
                <span className="flex items-center ml-2">
                  {oldValue ? (
                    <>
                      {i18n.t(oldValue)}
                      <MdArrowRightAlt className="mx-2" />
                      {i18n.t(value)}
                    </>
                  ) : (
                    ` ${i18n.t(value)}`
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentTracks;
