'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import {MdOutlineImage, MdOutlineUploadFile} from 'react-icons/md';
import {useRouter} from 'next/navigation';

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
import {useToast} from '@/ui/hooks/use-toast';
import {getImageURL} from '@/utils/image';
import {getCurrentDateTime} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  CHOOSE_GROUP,
  CONTENT,
  FORUM_GROUP,
  PUBLISH,
  TITLE,
} from '@/subapps/forum/common/constants';
import {Tiptap} from '@/subapps/forum/common/ui/components';
import {addPost} from '@/subapps/forum/common/action/action';

interface CreatePostProps {
  groups: any[];
  handleDialogOpen: (type: string) => void;
  onClose: () => void;
}

export const CreatePost = ({
  groups,
  handleDialogOpen,
  onClose,
}: CreatePostProps) => {
  const {toast} = useToast();
  const {workspaceURI, workspaceURL} = useWorkspace();
  const router = useRouter();

  const [editorContent, setEditorContent] = useState<string>('');

  const [post, setPost] = useState<any>({title: ''});
  const [group, setGroup] = useState<any>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    const post = {
      [name]: value,
    };
    setPost(post);
  };

  const handleSelect = (value: any) => {
    const group = groups.find((group: any) => group.name === value);
    setGroup(group);
  };

  const handlePost = async () => {
    const publicationDateTime = getCurrentDateTime();

    const result: any = await addPost({
      postDateT: publicationDateTime,
      group: {id: group?.id},
      title: post.title,
      workspaceURL,
    });

    if (result.success) {
      toast({
        variant: 'success',
        title: i18n.get('Post added successfully.'),
      });
      onClose();
      router.refresh();
      router.push(`${workspaceURI}/forum`);
    } else {
      toast({
        variant: 'destructive',
        title: i18n.get(result.message),
      });
    }
  };

  return (
    <ScrollArea className="h-screen lg:h-[80vh]">
      <div className="lg:h-[80vh] p-2 flex flex-col justify-between">
        <div className="flex flex-col mt-0 xl:mt-2 relative p-2 gap-4">
          <div className="mt-2 flex flex-col gap-1.5">
            <Label
              htmlFor="title"
              className="text-base font-medium text-foreground">
              {i18n.get(TITLE)}
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter title"
              className="shadow-none h-11 text-black placeholder:text-muted-foreground"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1.5 mt-3">
            <Label
              htmlFor="name"
              className="text-base font-medium text-foreground">
              {i18n.get(CHOOSE_GROUP)}
            </Label>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-full h-11 shadow-none">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map(group => (
                  <SelectItem value={group.name} key={group.id}>
                    <div className="flex items-center center justify-center gap-3 ">
                      <div className="w-6 h-6 rounded-lg overflow-hidden relative">
                        <Image
                          fill
                          src={getImageURL(group.image.id)}
                          alt={group.name}
                          objectFit="cover"
                        />
                      </div>
                      <div className="font-normal text-sm text-muted-foreground">
                        {group.name}
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
          <Button
            className="bg-success w-full mt-1 lg:mt-4"
            onClick={handlePost}>
            {i18n.get(PUBLISH)}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
