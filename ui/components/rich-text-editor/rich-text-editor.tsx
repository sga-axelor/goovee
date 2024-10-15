'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {EditorState} from 'draft-js';
import dynamic from 'next/dynamic';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './rich-text-editor.css';
import {cn} from '@/utils/css';
import {Skeleton} from '../skeleton';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(module => module.Editor),
  {
    ssr: false,
    loading: () => <Skeleton className={'min-h-[344px] xl:min-h-[244px]'} />,
  },
);

interface RichTextEditorProps {
  content?: string | any;
  classNames?: {
    toolbarClassName?: string;
    wrapperClassName?: string;
    editorClassName?: string;
  };
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (content: string) => void;
}

export const RichTextEditor = ({
  content,
  onChange,
  classNames,
  ...rest
}: RichTextEditorProps) => {
  const {
    toolbarClassName = '',
    wrapperClassName = '',
    editorClassName = '',
  } = classNames || {};

  const initiated = useRef(false);

  const [editorState, setEditorState] = useState<EditorState>(
    content
      ? EditorState.createWithContent(stateFromHTML(content)) ||
          EditorState.createEmpty()
      : EditorState.createEmpty(),
  );

  const handleChange = useCallback(
    (editorState: EditorState) => {
      setEditorState(editorState);
      const contentState = editorState.getCurrentContent();
      const htmlVersion = stateToHTML(contentState);
      onChange?.(htmlVersion);
    },
    [onChange],
  );

  useEffect(() => {
    if (initiated.current) {
      setEditorState(
        EditorState.createWithContent(stateFromHTML(content)) ||
          EditorState.createEmpty(),
      );
    }

    initiated.current = true;
  }, [content]);

  return (
    <Editor
      editorState={editorState}
      toolbarClassName={cn('bg-gray-700 mt-2', toolbarClassName)}
      wrapperClassName={cn(
        'rounded-sm overflow-hidden max-h-fit overflow-x-hidden break-words resize-y border-gray-100 border rounded-md',
        wrapperClassName,
      )}
      editorClassName={cn('min-h-[300px] xl:min-h-[200px]', editorClassName)}
      onEditorStateChange={handleChange}
      editorStyle={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
      mention={{
        separator: ' ',
      }}
      {...rest}
    />
  );
};

export default RichTextEditor;
