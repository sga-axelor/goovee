'use client';

import React, {useCallback} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {
  SUBAPP_CODES,
  SUBAPP_PAGE,
  DEFAULT_LIMIT,
  URL_PARAMS,
} from '@/constants';
import {i18n} from '@/locale';
import {Search, TableList} from '@/ui/components';
import {useSortBy} from '@/ui/hooks';
import {PortalWorkspace} from '@/types';
import {useToast, useSearchParams} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {Survey} from '@/subapps/survey/common/types';
import {
  surveyColumns,
  partnerResponseColumns,
  SearchItem,
} from '@/subapps/survey/common/ui/components';
import {getAllSurveys} from '@/subapps/survey/common/action/action';
import {SURVEY_URL_PARAMS} from '@/subapps/survey/common/constants';

type ContentProps = {
  surveys: any;
  responses: any;
  workspace: PortalWorkspace;
  responsesPageInfo: any;
  surveysPageInfo: any;
  isConnected?: boolean;
};

export default function Content({
  surveys = [],
  responses = [],
  surveysPageInfo = {},
  responsesPageInfo = {},
  workspace,
  isConnected = false,
}: ContentProps) {
  const [sortedSurveys, surveySortOrder, toggleSurveySortOrder] =
    useSortBy(surveys);
  const [sortedResponses, responseSortOrder, toggleResponseSortOrder] =
    useSortBy(responses);

  const {update} = useSearchParams();

  const {toast} = useToast();
  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowOpenClick = (survey: Survey) => {
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.survey}/${SUBAPP_PAGE.openSurvey}/${survey.id}`,
    );
  };

  const handleRowResponseClick = (response: Survey) => {
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.survey}/${SUBAPP_PAGE.responseSurvey}/${response.id}`,
    );
  };

  const handleSurveySearch = (term: string) => {
    if (term.length === 0) {
      update([{key: URL_PARAMS.search, value: term}], {scroll: false});
    }
  };

  const fetchAllSurveys = async () => {
    try {
      const result: any = await getAllSurveys({
        workspace,
        limit: DEFAULT_LIMIT,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: i18n.t(
            result.message ?? 'Something went wrong while searching!',
          ),
        });
      }

      return result.surveys;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: i18n.t(
          error instanceof Error ? error.message : 'Unknown error occurred',
        ),
      });
    }
  };

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, term: string) => {
      if (e.key === 'Enter' && term.trim().length > 0) {
        update([{key: URL_PARAMS.search, value: term}], {scroll: false});
      }
    },
    [update],
  );

  const renderSearch = () => {
    return (
      <Search
        searchKey={'name'}
        findQuery={fetchAllSurveys}
        onSearch={handleSurveySearch}
        renderItem={SearchItem}
        onItemClick={handleRowOpenClick}
        onKeyDown={handleSearchKeyDown}
      />
    );
  };

  return (
    <div className="mb-16 lg:mb-0">
      <div className="container my-6 space-y-6 mx-auto">
        {renderSearch()}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl">
            {i18n.t('Available surveys')}
          </h2>
          <TableList
            columns={surveyColumns}
            rows={sortedSurveys}
            sort={surveySortOrder}
            onSort={toggleSurveySortOrder}
            onRowClick={handleRowOpenClick}
            pageInfo={surveysPageInfo}
            pageParamKey={SURVEY_URL_PARAMS.page}
          />
        </div>
        {isConnected && (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-xl">
              {i18n.t('Partner responses')}
            </h2>
            <TableList
              columns={partnerResponseColumns}
              rows={sortedResponses}
              sort={responseSortOrder}
              onSort={toggleResponseSortOrder}
              onRowClick={handleRowResponseClick}
              pageInfo={responsesPageInfo}
              pageParamKey={SURVEY_URL_PARAMS.responsePage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
