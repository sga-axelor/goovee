'use client';

import * as React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Website} from '@/types';
import {SUBAPP_CODES} from '@/constants';

export function LanguageSelection({languageList, active}: any) {
  const {workspaceURL} = useWorkspace();
  const router = useRouter();

  if (!languageList?.length) return null;

  const handleLanguageChange = (websiteSlug: Website['slug']) => {
    router.push(`${workspaceURL}/${SUBAPP_CODES.website}/${websiteSlug}`);
  };

  return (
    <Select defaultValue={active} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an locale" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Locales</SelectLabel>
          {languageList
            .filter((item: any) => item.language && item.website)
            .map((item: any) => {
              const {language, website} = item;
              return (
                <SelectItem value={website.slug} key={website.slug}>
                  {language.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
