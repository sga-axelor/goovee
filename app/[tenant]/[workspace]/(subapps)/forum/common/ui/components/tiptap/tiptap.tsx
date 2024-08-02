'use client';
import {EditorContent, useEditor} from '@tiptap/react';
import React, {Dispatch, SetStateAction, useCallback} from 'react';

import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaQuoteRight,
  FaRedo,
  FaStrikethrough,
  FaUndo,
} from 'react-icons/fa';
import {
  MdDelete,
  MdFormatUnderlined,
  MdHorizontalRule,
  MdLink,
} from 'react-icons/md';
import {PiArrowElbowDownLeftDuotone} from 'react-icons/pi';

// ---- CORE IMPORTS ---- //
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {HEADING_LEVEL, TEXT_ALIGNMENT} from '@/subapps/forum/common/constants';
import {Level} from '@/subapps/forum/common/types/forum';
import './tiptap.css';

interface TiptapProps {
  content: string;
  setEditorContent: Dispatch<SetStateAction<string>>;
}

const extensions = [
  StarterKit,
  TextStyle,
  BulletList,
  Underline,
  ListItem,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
  }),
];

export const Tiptap = ({content, setEditorContent}: TiptapProps) => {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null || url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({href: url}).run();
  }, [editor]);

  if (!editor) return null;

  const stringToLevel = (value: string): Level => {
    const level = parseInt(value, 10);
    if (level >= 1 && level <= 6) {
      return level as Level;
    }
    return 1;
  };

  const handleHeadingChange = (value: string) => {
    editor
      .chain()
      .focus()
      .toggleHeading({level: stringToLevel(value)})
      .run();
  };

  const handleTextAlignment = (value: string) => {
    editor.chain().focus().setTextAlign(value).run();
  };

  return (
    <div className="rounded-lg overflow-hidden mt-2 border border-border relative">
      <div className="flex flex-wrap gap-[2px] items-center justify-center bg-gray-200 p-2 rounded-tl-lg rounded-tr-lg">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          } disabled:opacity-50`}>
          <FaBold />
        </button>

        {/*  Italic*/}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive('italic')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          } disabled:opacity-50`}>
          <FaItalic />
        </button>
        {/* strike through */}
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${
            editor.isActive('strike')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          } disabled:opacity-50`}>
          <FaStrikethrough />
        </button>

        {/* paragraph */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded ${
            editor.isActive('paragraph')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}>
          <FaParagraph />
        </button>

        {/*underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${
            editor.isActive('underline')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          } disabled:opacity-50`}>
          <MdFormatUnderlined />
        </button>

        {/* Delete style */}
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-2 rounded bg-gray-200 text-gray-800">
          <MdDelete />
        </button>

        {/* HEADING TAG for Big screen */}
        <div className="hidden xl:flex flex-row gap-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 1}).run()
            }
            className={`p-1 rounded text-lg flex items-center gap-0  ${
              editor.isActive('heading', {level: 1})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            <FaHeading /> 1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 2}).run()
            }
            className={`p-2 rounded text-md flex items-center ${
              editor.isActive('heading', {level: 2})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-00'
            }`}>
            <FaHeading /> 2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 3}).run()
            }
            className={`p-2 rounded text-base flex items-center ${
              editor.isActive('heading', {level: 3})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            <FaHeading /> 3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 4}).run()
            }
            className={`p-2 rounded text-sm  flex  items-center ${
              editor.isActive('heading', {level: 4})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            <FaHeading /> 4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 5}).run()
            }
            className={`p-2 rounded text-xs flex items-center ${
              editor.isActive('heading', {level: 5})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            <FaHeading /> 5
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({level: 6}).run()
            }
            className={`p-2 rounded text-xs flex items-center ${
              editor.isActive('heading', {level: 6})
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            <FaHeading /> 6
          </button>
        </div>
        {/* HEADING TAG for mobile screen */}
        {/* for mobile screen */}
        <div className="block xl:hidden ">
          <Select onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-fit shadow-none focus:border-none">
              <SelectValue placeholder="H" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {HEADING_LEVEL.map(level => (
                  <SelectItem
                    key={level}
                    value={String(level)}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({level: level}).run()
                    }>
                    <button
                      className={`p-2 rounded text-xs flex items-center w-full ${
                        editor.isActive('heading', {level})
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                      <FaHeading /> {level}
                    </button>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* unordered list */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}>
          <FaListUl />
        </button>

        {/* ordered list */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive('orderedList')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}>
          <FaListOl />
        </button>

        {/* Block qoute */}

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${
            editor.isActive('blockquote')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}>
          <FaQuoteRight />
        </button>

        {/* horizonal rule */}

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded bg-gray-200 text-gray-800">
          <MdHorizontalRule />
        </button>

        {/* New line */}
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="p-2 rounded bg-gray-200 text-gray-800">
          <PiArrowElbowDownLeftDuotone />
        </button>

        {/* Undo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded bg-gray-200 text-gray-800 disabled:opacity-50">
          <FaUndo />
        </button>

        {/* Redo */}
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded bg-gray-200 text-gray-800 disabled:opacity-50">
          <FaRedo />
        </button>

        {/* Text aligment */}
        <div className="">
          <Select onValueChange={handleTextAlignment}>
            <SelectTrigger className="w-fit">
              <SelectValue
                placeholder="A :"
                className="font-bold  bg-transparent focus:border-none p-0"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectContent>
                {TEXT_ALIGNMENT.map(item => (
                  <SelectItem value={item.name} key={item.name}>
                    <button
                      className={`p-2 rounded ${
                        editor.isActive(item.name)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      } disabled:opacity-50`}>
                      <item.icon className="text-xl font-bold text-gray-800" />
                    </button>
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={setLink}
          className={`p-2 rounded ${
            editor.isActive('link')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          } disabled:opacity-50`}>
          <MdLink />
        </button>
      </div>
      <div className="rounded-lg p-4 bg-white  shadow-none w-full">
        <EditorContent
          editor={editor}
          className="min-h-[300px]  xl:min-h-[200px] max-h-fit overflow-x-hidden break-words resize-y"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        />
      </div>
    </div>
  );
};
