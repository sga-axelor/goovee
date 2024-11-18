'use client';

import Link from 'next/link';
import React from 'react';

// ---- CORE IMPORTS ---- //
import {DEFAULT_LIMIT, SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {Search, TableList} from '@/ui/components';
import {MdArrowForward} from 'react-icons/md';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSortBy} from '@/ui/hooks';
import {PortalWorkspace} from '@/types';
import {useToast} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {Survey} from '@/subapps/survey/common/types';
import {
  surveyColumns,
  partnerResponseColumns,
  SearchItem,
} from '@/subapps/survey/common/ui/components';
import {getAllSurveys} from '@/subapps/survey/common/action/action';

type ContentProps = {
  surveys: any;
  responses: any;
  workspace: PortalWorkspace;
};

export default function Content({
  surveys = [],
  responses = [],
  workspace,
}: ContentProps) {
  const {workspaceURI} = useWorkspace();
  const [sortedSurveys, surveySortOrder, toggleSurveySortOrder] =
    useSortBy(surveys);
  const [sortedResponses, responseSortOrder, toggleResponseSortOrder] =
    useSortBy(responses);

  const {toast} = useToast();

  const handleRowClick = (survey: Survey) => {};

  const handleSurveySearch = async () => {
    try {
      const result: any = await getAllSurveys({
        workspace,
        limit: DEFAULT_LIMIT,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: i18n.get(
            result.message ?? i18n.get('Something went wrong while searching!'),
          ),
        });
      }

      return result;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: i18n.get(
          error instanceof Error ? error.message : 'Unknown error occurred',
        ),
      });
    }
  };

  const renderSearch = () => {
    return (
      <Search
        searchKey={'name'}
        findQuery={handleSurveySearch}
        renderItem={SearchItem}
        onItemClick={handleRowClick}
      />
    );
  };

  return (
    <div className="mb-16 lg:mb-0">
      <div className="container my-6 space-y-6 mx-auto">
        {renderSearch()}

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl">{i18n.get('Open Surveys')}</h2>

          <TableList
            columns={surveyColumns}
            rows={sortedSurveys}
            sort={surveySortOrder}
            onSort={toggleSurveySortOrder}
            onRowClick={handleRowClick}
          />
          <div className="flex justify-end p-4">
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.survey}`}
              className="inline-flex gap-1 items-center text-success text-sm font-medium">
              {i18n.get('See all surveys')}
              <MdArrowForward />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl">
            {i18n.get('Partner Responses')}
          </h2>
          <TableList
            columns={partnerResponseColumns}
            rows={sortedResponses}
            sort={responseSortOrder}
            onSort={toggleResponseSortOrder}
            onRowClick={handleRowClick}
          />
          <div className="flex justify-end p-4">
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.survey}`}
              className="inline-flex gap-1 items-center text-success text-sm font-medium">
              {i18n.get('See all responses')}
              <MdArrowForward />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
