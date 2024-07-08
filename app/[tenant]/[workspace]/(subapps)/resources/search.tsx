'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {cn} from '@/utils/css';
import {parseDate} from '@/utils';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getFileTypeIcon, getIconColor} from '@/subapps/resources/common/utils';
import {DynamicIcon} from '@/subapps/resources/common/ui/components';
import {findDmsFiles} from './action';

export function Search() {
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    setOpen(search ? true : false);
    if (search) {
      findDmsFiles({search}).then(setFiles);
    }
  }, [search]);

  return (
    <div
      className="lg:w-auto w-screen h-[300px] lg:h-[353px] flex items-center justify-center bg-no-repeat bg-[#1c1f55] bg-cover"
      style={{backgroundImage: 'url("/images/hero-bg.svg")'}}>
      <div className="px-4 flex text-white items-center flex-col justify-center">
        <h2 className="lg:text-[32px] text-2xl font-semibold mb-2">
          Resources
        </h2>
        <p className="lg:text-lg text-base font-medium mb-8 md:max-w-screen-sm lg:max-w-screen-md text-center">
          Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium
          etiam viverra. Ac at non pretium etiam
        </p>
        <div className="w-full relative">
          <Command className="p-0 bg-white">
            <CommandInput
              placeholder="Search here"
              className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] py-4 pr-[132px] h-14 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
              value={search}
              onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />

            <CommandList
              className={cn(
                'absolute bg-white top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
                open ? 'block' : 'hidden',
              )}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="p-2">
                {Boolean(files?.length)
                  ? files.map(file => (
                      <CommandItem
                        key={file.id}
                        value={file.fileName}
                        className="block py-2 sm:px-6">
                        <ResourceItem resource={file} />
                      </CommandItem>
                    ))
                  : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );
}

function ResourceItem({resource}: any) {
  const {isDirectory} = resource;
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRedirection = (resource: any) => () => {
    if (isDirectory) {
      router.push(`${workspaceURI}/resources/categories?id=${resource.id}`);
    } else {
      router.push(`${workspaceURI}/resources/${resource.id}`);
    }
  };

  const author = resource.createdBy?.name || '--';
  const date = parseDate(resource?.createdOn) || '--';
  const size = resource?.metaFile?.sizeText || '--';

  const icon = isDirectory
    ? 'md-Web'
    : getFileTypeIcon(resource.metaFile?.fileType);

  const iconColor = getIconColor(icon);

  return (
    <div
      className="border-b cursor-pointer"
      key={resource.id}
      onClick={handleRedirection(resource)}>
      <div className="leading-5 text-sm space-y-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2 grow">
            <DynamicIcon
              icon={icon}
              className={'h-6 w-6 shrink-0'}
              {...(iconColor
                ? {
                    style: {
                      color: iconColor,
                    },
                  }
                : {})}
            />
            <h3 className="font-semibold line-clamp-1">{resource.fileName}</h3>
          </div>
          {false && (
            <div className="flex gap-16 md:gap-12 lg:gap-16 shrink-0 justify-between">
              <p className="hidden sm:inline-block whitespace-nowrap">
                {author}
              </p>
              <p className="hidden sm:inline-block whitespace-nowrap">{date}</p>
              <p className="hidden sm:inline-block whitespace-nowrap">{size}</p>
            </div>
          )}
        </div>
        {false && (
          <div className="sm:hidden flex items-center justify-between">
            <p className="line-clamp-1">{author}</p>
            <p className="line-clamp-1">{date}</p>
            <p className="line-clamp-1">{size}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
