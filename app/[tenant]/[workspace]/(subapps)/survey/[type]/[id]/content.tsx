'use client';

import React, {useEffect} from 'react';
import {SurveyViewer} from '@axelor/react-survey-components';

import {ensureAuth} from '@/subapps/survey/common/utils/auth-helper';

const Content = ({
  survey,
  response,
  partnerId,
}: {
  survey: any;
  response?: any;
  partnerId: number;
}) => {
  const {config, themeConfig} = survey;

  useEffect(() => {
    ensureAuth();
  }, []);

  return (
    <SurveyViewer
      config={config}
      theme={themeConfig}
      response={response}
      readonly={response != null && !survey.canAnswerBeModified}
      completeData={{
        partnerId,
        configId: survey.id,
        responseId: response?.id,
        modelName: survey.customModel?.name,
      }}
    />
  );
};
export default Content;
