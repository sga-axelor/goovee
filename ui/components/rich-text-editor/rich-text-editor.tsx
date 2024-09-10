'use client';

import {useCallback, useState} from 'react';
import {EditorState} from 'draft-js';
import dynamic from 'next/dynamic';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './rich-text-editor.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(module => module.Editor),
  {
    ssr: false,
  },
);

interface RichTextEditorProps {
  content?: string | any;
  onChange?: (content: string) => void;
}

export const RichTextEditor = ({content, onChange}: RichTextEditorProps) => {
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

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="bg-gray-700 mt-2"
      wrapperClassName="rounded-sm overflow-hidden max-h-fit overflow-x-hidden break-words resize-y border-gray-100 border rounded-md"
      editorClassName="min-h-[300px] xl:min-h-[200px]"
      onEditorStateChange={handleChange}
      editorStyle={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
      mention={{
        separator: ' ',
      }}
    />
  );
};

export default RichTextEditor;
