'use client';

import Link from 'next/link';
import React from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {Search, TableList} from '@/ui/components';
import {MdArrowForward} from 'react-icons/md';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSortBy} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {Survey} from '@/subapps/survey/common/types';
import {
  surveyColumns,
  partnerResponseColumns,
} from '@/subapps/survey/common/ui/components';

type ContentProps = {
  surveys: any;
  responses: any;
};

export default function Content({surveys = [], responses = []}: ContentProps) {
  const {workspaceURI} = useWorkspace();
  const [sortedSurveys, surveySortOrder, toggleSurveySortOrder] =
    useSortBy(surveys);
  const [sortedResponses, responseSortOrder, toggleResponseSortOrder] =
    useSortBy(responses);

  const handleRowClick = (survey: Survey) => {};

  return (
    <div className="mb-16 lg:mb-0">
      <div className="container my-6 space-y-6 mx-auto">
        <Search findQuery={undefined} renderItem={undefined} />

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
