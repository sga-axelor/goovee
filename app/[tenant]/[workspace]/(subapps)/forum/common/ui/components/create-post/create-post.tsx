'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import {MdOutlineImage, MdOutlineUploadFile} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Button,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CHOOSE_GROUP,
  CONTENT,
  FORUM_GROUP,
  PUBLISH,
  TITLE,
} from '@/subapps/forum/common/constants';
import {Tiptap} from '@/subapps/forum/common/ui/components';

interface CreatePostProps {
  handleDialogOpen: (type: string) => void;
}

export const CreatePost = ({handleDialogOpen}: CreatePostProps) => {
  const [editorContent, setEditorContent] = useState<string>('');

  return (
    <ScrollArea className="h-screen lg:h-[80vh]">
      <div className="lg:h-[80vh] p-2 flex flex-col justify-between">
        <div className="flex flex-col mt-0 xl:mt-2 relative p-2 gap-4">
          <div className="mt-2 flex flex-col gap-1.5">
            <Label
              htmlFor="name"
              className="text-base font-medium text-foreground">
              {i18n.get(TITLE)}
            </Label>
            <Input
              id="name"
              placeholder="Enter title"
              className="shadow-none h-11 text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5 mt-3">
            <Label
              htmlFor="name"
              className="text-base font-medium text-foreground">
              {i18n.get(CHOOSE_GROUP)}
            </Label>
            <Select>
              <SelectTrigger className="w-full h-11 shadow-none">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {FORUM_GROUP.map(item => (
                  <SelectItem value={item.name} key={item.id}>
                    <div className="flex items-center center justify-center gap-3 ">
                      <div className="w-6 h-6 rounded-lg overflow-hidden relative">
                        <Image
                          fill
                          src={item.img}
                          alt={item.name}
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
          <div className="mt-2">
            <span className="text-base font-medium text-foreground">
              {i18n.get(CONTENT)}
            </span>
            <Tiptap
              content={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>
        </div>
        <div className="w-full mt-2">
          <div className="flex gap-2 lg:gap-4 p-2">
            <div className="w-6 h-6" onClick={() => handleDialogOpen('image')}>
              <MdOutlineImage className="w-full h-full cursor-pointer" />
            </div>
            <div className="w-6 h-6" onClick={() => handleDialogOpen('file')}>
              <MdOutlineUploadFile className="w-full h-full cursor-pointer " />
            </div>
          </div>
          <Button className="bg-success w-full mt-1 lg:mt-4">
            {i18n.get(PUBLISH)}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
