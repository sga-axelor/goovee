'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {convertToRaw, ContentState, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import './rich-text-editor.css';

interface RichTextEditorProps {
  content?: string | any;
  onChange?: (content: string) => void;
}

const editor = {
  toState(text: string) {
    if (!text) return EditorState.createEmpty();

    const draft = htmlToDraft(text);

    if (!draft) return EditorState.createEmpty();

    const content = ContentState.createFromBlockArray(
      draft.contentBlocks,
      draft.entityMap,
    );

    return EditorState.createWithContent(content);
  },
  toString(editorState: EditorState) {
    return (
      editorState && draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  },
};

export const RichTextEditor = ({content, onChange}: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState<EditorState>(
    editor.toState(content) || EditorState.createEmpty(),
  );

  const initiated = useRef(false);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      setEditorState(editorState);
      onChange?.(editor.toString(editorState));
    },
    [onChange],
  );

  useEffect(() => {
    if (initiated.current) {
    }

    initiated.current = true;
  }, [content]);

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
