'use client';

import {useEffect, useState} from 'react';
import {convertToRaw, ContentState, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import './rich-text-editor.module.scss';

interface RichTextEditorProps {
  content?: string;
  handleContentChange: (text: string) => void;
}

export const RichTextEditor = ({
  content: propContent,
  handleContentChange,
}: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    handleContentChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
    );
  };

  useEffect(() => {
    if (propContent) {
      const contentBlock = htmlToDraft(propContent);
      if (contentBlock) {
        const {contentBlocks, entityMap} = contentBlock;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap,
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [propContent]);

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="bg-gray-700 mt-2"
      wrapperClassName="rounded-sm overflow-hidden max-h-fit overflow-x-hidden break-words resize-y border-gray-100 border rounded-md"
      editorClassName="min-h-[300px] xl:min-h-[200px]"
      onEditorStateChange={onEditorStateChange}
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
