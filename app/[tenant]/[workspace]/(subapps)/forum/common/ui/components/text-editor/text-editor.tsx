'use client';

import {convertToRaw, EditorState} from 'draft-js';
import {useState} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import './text-editor.css';

interface TextEditorProps {
  handleContentChange: (text: string) => void;
}

export function TextEditor({handleContentChange}: TextEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = function (editorState: any) {
    setEditorState(editorState);
    handleContentChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
    );
  };

  return (
    <>
      <Editor
        editorState={editorState}
        toolbarClassName="bg-gray-700 "
        wrapperClassName="rounded-sm overflow-hidden max-h-fit overflow-x-hidden break-words resize-y"
        editorClassName="min-h-[300px] xl:min-h-[200px] "
        onEditorStateChange={onEditorStateChange}
        editorStyle={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
        mention={{
          separator: ' ',
        }}
      />
    </>
  );
}
