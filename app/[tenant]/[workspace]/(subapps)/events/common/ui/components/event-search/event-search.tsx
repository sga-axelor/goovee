'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {debounce} from 'lodash';

// ---- CORE IMPORTS ---- //
import {Command, CommandInput} from '@/ui/components/command';
import {useToast} from '@/ui/hooks';
import {getAllEvents} from '../../../actions/actions';
import {i18n} from '@/lib/core/i18n';
import {PortalWorkspace} from '@/types';

export const EventSearch = ({
  searchKey = 'title',
  workspace,
  search,
  handleSearch,
  handleResult,
  handleSearchStatus,
}: {
  searchKey: any;
  search: string;
  workspace: PortalWorkspace;
  handleSearch: (x: string) => void;
  handleResult: (x: []) => void;
  handleSearchStatus: (x: boolean) => void;
}) => {
  const {toast} = useToast();
  const debouncedFindQuery = useCallback(
    debounce(async (query: string) => {
      if (query) {
        const results = await findQuery(query);
        handleResult(results);
      } else {
        handleResult([]);
      }
      handleSearchStatus(false);
    }, 500),
    [],
  );

  useEffect(() => {
    handleSearchStatus(true);
    debouncedFindQuery(search);
  }, [search]);

  const findQuery = async (query: string) => {
    try {
      const response: any = await getAllEvents({
        workspace,
        search: query,
        onlyRegisteredEvent: true,
      });
      if (response?.error) {
        toast({
          variant: 'destructive',
          description: i18n.get(
            response.error || 'Something went wrong while searching!',
          ),
        });
        return [];
      }

      return response.events || [];
    } catch (error) {
      toast({
        variant: 'destructive',
        description: i18n.get('Something went wrong while searching!'),
      });
      return [];
    }
  };

  return (
    <>
      <div className="w-full relative">
        <Command className="p-0 bg-white">
          <CommandInput
            placeholder="Search here"
            className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] py-4 pr-[132px] h-14 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
            value={search}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
          />
        </Command>
      </div>
    </>
  );
};
